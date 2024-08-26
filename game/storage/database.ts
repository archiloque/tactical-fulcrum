import { AlertVariant, showAlert } from "../../common/front/alert"
import { EMPTY_TILE, Tile, TileType } from "../../common/models/tile"
import { PlayedTower } from "../models/played-tower"
import { PlayerInfo } from "../models/player-info"
import { Position3D } from "../models/tuples"

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
  saveName = "saveName",
  timestamp = "timestamp",
}

const enum PlayedTowerRoomModelAttributes {
  id = ID_ATTRIBUTE,
  playerTowerId = "playerTowerId",
  roomIndex = "roomIndex",
  nexus = "nexus",
  content = "content",
}

interface WithId {
  id?: number
}

interface PlayerPosition {
  column: number
  line: number
  room: number
}

interface TowerModel extends WithId {
  towerName: string
}

interface PlayedTowerModel extends WithId {
  towerId: number
  slot: number
  saveName: string | null
  timestamp: Date
  playerPosition: PlayerPosition
  playerInfo: PlayerInfo
}

interface PositionedTile {
  line: number
  column: number
  tile: Tile
}

interface PlayerTowerRoomModel extends WithId {
  playerTowerId: number
  roomIndex: number
  nexus: number
  content: PositionedTile[]
}

const CURRENT_PLAYED_TOWER_SLOT = -1

async function runRequest(request: IDBRequest): Promise<any> {
  return new Promise<any>(function (resolve, reject) {
    request.onsuccess = (): void => {
      console.debug("DatabaseAccess", "runRequest", request.result)
      resolve(request.result)
    }
    request.onerror = (): void => {
      console.error("DatabaseAccess", "runRequest", request.error)
      reject()
    }
  })
}

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
            PlayedTowerRoomModelAttributes.nexus,
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

  private createTransaction<M extends WithId>(tableName: TableName, mode: IDBTransactionMode): DatabaseAccessStore<M> {
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
    return {
      playerInfo: playedTower.playerInfo,
      playerPosition: {
        column: playedTower.playerPosition!.column,
        line: playedTower.playerPosition!.line,
        room: playedTower.playerPosition!.room,
      },
      saveName: saveName,
      slot: slot,
      towerId: playedTower.playedTowerModelId!!,
      timestamp: new Date(),
    }
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
    console.debug(
      "DatabaseAccess",
      "savePlayedTowerRoom",
      playedTower.playedTowerModelId,
      playedTower.playerPosition?.room,
    )
    const playedTowerRoomStore: DatabaseAccessStore<PlayerTowerRoomModel> = this.createTransaction(
      TableName.playedTowerRoom,
      "readwrite",
    )
    const roomModel = (await playedTowerRoomStore
      .index(IndexName.playedTowerRoomByPlayedTowerAndRoomAndNexusIndex)
      .get([playedTower.playedTowerModelId!!, playedTower.playerPosition!!.room, 0]))!!
    roomModel.content = this.roomsToPositionedTiles(playedTower.currentRoom!!)
    await playedTowerRoomStore.put(roomModel)
  }

  async initPlayedTower(playedTower: PlayedTower): Promise<number> {
    console.debug("DatabaseAccess", "initPlayedTower", playedTower.tower.name)
    const playedTowerModel = await this.toCurrentPlayedTowerModel(playedTower)
    const store: DatabaseAccessStore<PlayedTowerModel> = this.createTransaction(TableName.playedTower, "readwrite")
    const playedTowerModelId: number = await store.add(playedTowerModel)
    playedTower.playedTowerModelId = playedTowerModelId
    console.debug("DatabaseAccess", "initPlayedTowerRooms", "tower", playedTower.tower.name)
    const store1: DatabaseAccessStore<PlayerTowerRoomModel> = this.createTransaction(
      TableName.playedTowerRoom,
      "readwrite",
    )

    const rooms: PlayerTowerRoomModel[] = await store1.all()

    const promises: Promise<any>[] = []
    for (const [roomIndex, room] of playedTower.tower.standardRooms.entries()) {
      const tiles: PositionedTile[] = this.roomsToPositionedTiles(room.tiles)
      console.debug("DatabaseAccess", "initPlayedTower", "room", playedTower.towerModelId, roomIndex, 0)
      const roomModel = rooms.find(
        (r) => r.nexus == 0 && r.roomIndex == roomIndex && r.playerTowerId == playedTower.playedTowerModelId,
      )
      const model: PlayerTowerRoomModel = {
        playerTowerId: playedTower.playedTowerModelId!!,
        roomIndex: roomIndex,
        nexus: 0,
        content: tiles,
      }
      if (roomModel !== undefined) {
        model.id = roomModel.id
      }
      promises.push(store1.put(model))
    }

    for (const [roomIndex, room] of playedTower.tower.nexusRooms.entries()) {
      const tiles: PositionedTile[] = this.roomsToPositionedTiles(room.tiles)
      console.debug("DatabaseAccess", "initPlayedTower", playedTower.towerModelId, roomIndex, 1)
      const roomModel = rooms.find(
        (r) => r.nexus == 1 && r.roomIndex == roomIndex && r.playerTowerId == playedTower.playedTowerModelId,
      )
      const model: PlayerTowerRoomModel = {
        playerTowerId: playedTower.playedTowerModelId!!,
        roomIndex: roomIndex,
        nexus: 1,
        content: tiles,
      }
      if (roomModel !== undefined) {
        model.id = roomModel.id
      }
      promises.push(store1.put(model))
    }
    await Promise.all(promises)
    console.debug("DatabaseAccess", "initPlayedTower", playedTower.tower.name, "over")
    return playedTowerModelId
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
    playedTower.playerPosition = new Position3D(
      playedTowerModel.playerPosition.room,
      playedTowerModel.playerPosition.line,
      playedTowerModel.playerPosition.column,
    )
    playedTower.playerInfo = playedTowerModel.playerInfo
    playedTower.currentRoom = await this.loadPlayedTowerRoom(playedTower, playedTowerModel.playerPosition.room)
    playedTower.calculateReachableTiles()
  }

  async loadPlayedTowerRoom(playedTower: PlayedTower, roomIndex: number): Promise<Tile[][]> {
    const playedTowerRoomStore: DatabaseAccessStore<PlayerTowerRoomModel> = this.createTransaction(
      TableName.playedTowerRoom,
      "readonly",
    )

    const roomModel = (await playedTowerRoomStore
      .index(IndexName.playedTowerRoomByPlayedTowerAndRoomAndNexusIndex)
      .get([playedTower.playedTowerModelId!!, roomIndex, 0]))!!

    const room = (roomModel.nexus == 1 ? playedTower.tower.nexusRooms : playedTower.tower.standardRooms)[
      roomModel.roomIndex
    ].clone()

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

class DatabaseAccessStore<M extends WithId> {
  private readonly store: IDBObjectStore

  constructor(store: IDBObjectStore) {
    this.store = store
  }

  async put(model: M): Promise<any> {
    console.debug("DatabaseAccessStore", "put", this.store.name, model)
    await runRequest(this.store.put(model))
  }

  async add(model: M): Promise<any> {
    console.debug("DatabaseAccessStore", "add", this.store.name, model)
    return await runRequest(this.store.add(model))
  }

  async all(): Promise<M[]> {
    console.debug("DatabaseAccessStore", "all", this.store.name)
    return await runRequest(this.store.getAll())
  }

  index(name: IndexName): DatabaseAccessIndex<M> {
    return new DatabaseAccessIndex<M>(this.store.index(name))
  }
}

class DatabaseAccessIndex<M extends WithId> {
  private readonly index: IDBIndex
  constructor(index: IDBIndex) {
    this.index = index
  }

  async get(query: IDBValidKey | IDBKeyRange): Promise<M | undefined> {
    return await runRequest(this.index.get(query))
  }

  async getKey(query: IDBValidKey | IDBKeyRange): Promise<number | undefined> {
    return await runRequest(this.index.getKey(query))
  }

  async getAll(query?: IDBValidKey | IDBKeyRange | null): Promise<M[]> {
    console.debug("DatabaseAccessIndex", "getAll", this.index.name, query)
    return await runRequest(this.index.getAll(query))
  }
}
