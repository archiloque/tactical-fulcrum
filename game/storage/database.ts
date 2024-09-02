import { AlertVariant, showAlert } from "../../common/front/alert"
import { DatabaseAccessIndex, DatabaseAccessStore, DatabaseModel, runRequest } from "./utils"
import { EMPTY_TILE, Tile, TileType } from "../../common/models/tile"
import { PlayedTowerModel, PlayerTowerRoomModel, PositionedTile, TowerModel } from "./models"
import { PlayedTower } from "../models/played-tower"
import { PlayerPosition } from "../models/player-position"
import { Room } from "../../common/models/room"
import { RoomType } from "../../common/data/room-type"

const enum TableName {
  tower = "tower",
  playedTower = "playedTower",
  playedTowerRoom = "playedTowerRoom",
}

const enum IndexName {
  towerIdIndex = `${TableName.tower}IdIndex`,

  towerNameIndex = `${TableName.tower}NameIndex`,

  playedTowerIdIndex = `${TableName.playedTower}IdIndex`,
  playedTowerByTowerIdAndSlot = `${TableName.playedTower}ByTowerIdAndSlot`,

  playedTowerRoomIdIndex = `${TableName.playedTowerRoom}IdIndex`,
  playedTowerRoomByPlayedTowerIndex = `${TableName.playedTowerRoom}ByPlayedTowerIndex`,
  playedTowerRoomByPlayedTowerAndRoomAndNexusIndex = `${TableName.playedTowerRoom}ByPlayedTowerAndRoomAndNexusIndex`,
}

const ID_ATTRIBUTE = "id"

const enum TowerModelAttributes {
  id = ID_ATTRIBUTE,
  towerName = "towerName",
}

const enum PlayedTowerModelAttributes {
  id = ID_ATTRIBUTE,
  towerId = "towerId",
  slot = "slot",
}

const enum PlayedTowerRoomModelAttributes {
  id = ID_ATTRIBUTE,
  playerTowerId = "playerTowerId",
  roomIndex = "roomIndex",
  roomType = "roomType",
  content = "content",
}

const CURRENT_PLAYED_TOWER_SLOT = -1

function createTable(db: IDBDatabase, tableName: TableName, tableIdIndex: IndexName): IDBObjectStore {
  console.debug("DatabaseAccess", "createTable", tableName)
  const store = db.createObjectStore(tableName, {
    keyPath: ID_ATTRIBUTE,
    autoIncrement: true,
  })
  store.createIndex(tableIdIndex, TowerModelAttributes.id, { unique: true })
  return store
}
export class DatabaseAccess {
  static readonly DATABASE_NAME = "tactical-fulcrum-game"
  private db: undefined | IDBDatabase

  constructor() {}

  async init(): Promise<void> {
    const databaseAccess = this
    return new Promise<void>(function (resolve, reject) {
      const request = window.indexedDB.open(DatabaseAccess.DATABASE_NAME, 2)
      request.onupgradeneeded = (event): void => {
        // @ts-ignore
        const db: IDBDatabase = event.target!.result
        const towerObjectStore = createTable(db, TableName.tower, IndexName.towerIdIndex)
        towerObjectStore.createIndex(IndexName.towerNameIndex, TowerModelAttributes.towerName, { unique: true })

        const playedTowerObjectStore = createTable(db, TableName.playedTower, IndexName.playedTowerIdIndex)
        playedTowerObjectStore.createIndex(
          IndexName.playedTowerByTowerIdAndSlot,
          [PlayedTowerModelAttributes.towerId, PlayedTowerModelAttributes.slot],
          { unique: true },
        )

        const playedTowerRoomObjectStore = createTable(db, TableName.playedTowerRoom, IndexName.playedTowerRoomIdIndex)
        playedTowerRoomObjectStore.createIndex(
          IndexName.playedTowerRoomByPlayedTowerIndex,
          [PlayedTowerRoomModelAttributes.playerTowerId],
          {
            unique: false,
          },
        )
        playedTowerRoomObjectStore.createIndex(
          IndexName.playedTowerRoomByPlayedTowerAndRoomAndNexusIndex,
          [
            PlayedTowerRoomModelAttributes.playerTowerId,
            PlayedTowerRoomModelAttributes.roomIndex,
            PlayedTowerRoomModelAttributes.roomType,
          ],
          {
            unique: true,
          },
        )
      }
      request.onsuccess = (): void => {
        databaseAccess.db = request.result
        resolve()
      }
      request.onerror = (): void => {
        showAlert(`Error when creating database: ${request.error}`, AlertVariant.danger)
        reject()
      }
    })
  }

  private createTransaction<M extends DatabaseModel>(
    tableName: TableName,
    mode: IDBTransactionMode,
  ): DatabaseAccessStore<M> {
    const transaction = this.db!.transaction(tableName, mode)
    return new DatabaseAccessStore(transaction.objectStore(tableName))
  }

  async getTowerId(towerName: string): Promise<number> {
    console.debug("DatabaseAccess", "getTowerId", towerName)
    const store: DatabaseAccessStore<TowerModel> = this.createTransaction(TableName.tower, "readwrite")
    const index = store.index(IndexName.towerNameIndex)
    const towerModelId: number | undefined = await index.getKey(towerName)
    if (towerModelId === undefined) {
      const tower: TowerModel = { towerName: towerName }
      console.debug("DatabaseAccess", "getTowerId", "create tower")
      return await store.add(tower)
    } else {
      return towerModelId!!
    }
  }

  async getCurrentPlayedTowerModelId(towerId: number): Promise<number | undefined> {
    console.debug("DatabaseAccess", "currentPlayedTowerModelId", towerId)
    const store: DatabaseAccessStore<PlayedTowerModel> = this.createTransaction(TableName.playedTower, "readonly")
    const index: DatabaseAccessIndex<PlayedTowerModel> = store.index(IndexName.playedTowerByTowerIdAndSlot)
    return await index.getKey([towerId, -1])
  }

  async clear(): Promise<void> {
    this.db = undefined
    await runRequest(window.indexedDB.deleteDatabase(DatabaseAccess.DATABASE_NAME))
    return await this.init()
  }

  private async toPlayedTowerModel(
    playedTower: PlayedTower,
    slot: number,
    saveName: string | null,
  ): Promise<PlayedTowerModel> {
    const playerPosition = playedTower.position!!
    const result: PlayedTowerModel = {
      playerInfo: playedTower.playerInfo,
      position: {
        standard: playerPosition.standard,
        nexus: playerPosition.nexus,
        roomType: playerPosition.roomType!!,
      },
      saveName: saveName,
      slot: slot,
      towerId: playedTower.towerModelId!!,
      timestamp: new Date(),
    }
    if (playedTower.playedTowerModelId !== undefined) {
      result.id = playedTower.playedTowerModelId
    }
    return result
  }

  private async toCurrentPlayedTowerModel(playedTower: PlayedTower): Promise<PlayedTowerModel> {
    return await this.toPlayedTowerModel(playedTower, CURRENT_PLAYED_TOWER_SLOT, null)
  }

  private static readonly TILES_TYPES_INTERESTING: TileType[] = [
    TileType.door,
    TileType.enemy,
    TileType.item,
    TileType.key,
  ]

  private static readonly TILES_TYPES_TO_REMOVE: TileType[] = DatabaseAccess.TILES_TYPES_INTERESTING.concat([
    TileType.startingPosition,
  ])

  private roomsToPositionedTiles(room: Tile[][]): PositionedTile[] {
    const tiles: PositionedTile[] = []
    for (const [lineIndex, line] of room.entries()) {
      for (const [columnIndex, tile] of line.entries()) {
        if (DatabaseAccess.TILES_TYPES_INTERESTING.includes(tile.type)) {
          tiles.push({ line: lineIndex, column: columnIndex, tile: tile })
        }
      }
    }
    return tiles
  }

  async savePlayedTower(playedTower: PlayedTower): Promise<any> {
    console.debug("DatabaseAccess", "savePlayedTower", playedTower.playedTowerModelId)
    const playedTowerModel = await this.toCurrentPlayedTowerModel(playedTower)
    playedTowerModel.id = playedTower.playedTowerModelId
    const store: DatabaseAccessStore<PlayedTowerModel> = this.createTransaction(TableName.playedTower, "readwrite")
    await store.put(playedTowerModel)
  }

  async savePlayedTowerRoom(playedTower: PlayedTower): Promise<void> {
    console.debug("DatabaseAccess", "savePlayedTowerRoom", playedTower.playedTowerModelId)
    const playedTowerRoomStore: DatabaseAccessStore<PlayerTowerRoomModel> = this.createTransaction(
      TableName.playedTowerRoom,
      "readwrite",
    )
    const roomModel = (await playedTowerRoomStore
      .index(IndexName.playedTowerRoomByPlayedTowerAndRoomAndNexusIndex)
      .get([playedTower.playedTowerModelId!!, playedTower.position!!.position.room, playedTower.position!!.roomType]))!!
    roomModel.content = this.roomsToPositionedTiles(playedTower.currentRoom!!)
    await playedTowerRoomStore.put(roomModel)
  }

  async initPlayedTower(playedTower: PlayedTower): Promise<void> {
    console.debug("DatabaseAccess", "initPlayedTower", playedTower.tower.name)
    const playedTowerModel = await this.toCurrentPlayedTowerModel(playedTower)
    const playedTowerModelStore: DatabaseAccessStore<PlayedTowerModel> = this.createTransaction(
      TableName.playedTower,
      "readwrite",
    )

    if (playedTower.playedTowerModelId === undefined) {
      const playedTowerModelId: number = await playedTowerModelStore.add(playedTowerModel)
      playedTower.playedTowerModelId = playedTowerModelId
    } else {
      await playedTowerModelStore.put(playedTowerModel)
      const playerTowerRoomModelStore: DatabaseAccessStore<PlayerTowerRoomModel> = this.createTransaction(
        TableName.playedTowerRoom,
        "readwrite",
      )
      const roomModelsIds = await playerTowerRoomModelStore
        .index(IndexName.playedTowerRoomByPlayedTowerIndex)
        .getAllKeys()
      await Promise.all(
        roomModelsIds.map((roomModelId) => {
          playerTowerRoomModelStore.delete(roomModelId)
        }),
      )
    }

    const promises: Promise<any>[] = []
    for (const [roomIndex, room] of playedTower.tower.standardRooms.entries()) {
      promises.push(this.initPlayedTowerRoom(playedTower, room, roomIndex, RoomType.standard))
    }

    for (const [roomIndex, room] of playedTower.tower.nexusRooms.entries()) {
      promises.push(this.initPlayedTowerRoom(playedTower, room, roomIndex, RoomType.nexus))
    }
    await Promise.all(promises)
  }

  private async initPlayedTowerRoom(
    playedTower: PlayedTower,
    room: Room,
    roomIndex: number,
    roomType: RoomType,
  ): Promise<void> {
    const playerTowerRoomModelStore: DatabaseAccessStore<PlayerTowerRoomModel> = this.createTransaction(
      TableName.playedTowerRoom,
      "readwrite",
    )

    const tiles: PositionedTile[] = this.roomsToPositionedTiles(room.tiles)
    console.debug("DatabaseAccess", "initPlayedTowerRoom", playedTower.towerModelId, roomIndex, roomType)

    const roomModelId = await playerTowerRoomModelStore
      .index(IndexName.playedTowerRoomByPlayedTowerAndRoomAndNexusIndex)
      .getKey([playedTower.playedTowerModelId!!, roomIndex, roomType])

    const model: PlayerTowerRoomModel = {
      playerTowerId: playedTower.playedTowerModelId!!,
      roomIndex: roomIndex,
      roomType: roomType,
      content: tiles,
    }
    if (roomModelId !== undefined) {
      model.id = roomModelId
    }
    return playerTowerRoomModelStore.put(model)
  }

  async loadPlayedTower(playedTower: PlayedTower, playedTowerModelId: number): Promise<void> {
    console.debug("DatabaseAccess", "loadPlayedTower", playedTowerModelId)
    playedTower.playedTowerModelId = playedTowerModelId
    const playedTowerStore: DatabaseAccessStore<PlayedTowerModel> = this.createTransaction(
      TableName.playedTower,
      "readonly",
    )
    const index = playedTowerStore.index(IndexName.playedTowerIdIndex)
    const playedTowerModel = (await index.get(playedTowerModelId))!!
    console.debug("DatabaseAccess", "loadPlayedTower", playedTowerModel)

    playedTower.playerInfo = playedTowerModel.playerInfo

    const position = playedTowerModel.position
    playedTower.position = new PlayerPosition(position.standard, position.nexus, position.roomType)

    playedTower.currentRoom = await this.loadPlayedTowerRoom(
      playedTower,
      position.roomType,
      position.roomType === RoomType.nexus ? position.nexus.room : position.standard.room,
    )
    playedTower.calculateReachableTiles()
  }

  async loadPlayedTowerRoom(playedTower: PlayedTower, nexus: RoomType, roomIndex: number): Promise<Tile[][]> {
    const playedTowerRoomStore: DatabaseAccessStore<PlayerTowerRoomModel> = this.createTransaction(
      TableName.playedTowerRoom,
      "readonly",
    )

    const roomModel = (await playedTowerRoomStore
      .index(IndexName.playedTowerRoomByPlayedTowerAndRoomAndNexusIndex)
      .get([playedTower.playedTowerModelId!!, roomIndex, nexus]))!!

    const room = playedTower.tower.getRooms(nexus)[roomModel.roomIndex].clone()

    for (const [lineIndex, line] of room.entries()) {
      for (const [columnIndex, tile] of line.entries()) {
        if (DatabaseAccess.TILES_TYPES_TO_REMOVE.includes(tile.type)) {
          room[lineIndex][columnIndex] = EMPTY_TILE
        }
      }
    }
    for (const positionedTile of roomModel.content) {
      room[positionedTile.line][positionedTile.column] = positionedTile.tile
    }

    return room
  }
}
