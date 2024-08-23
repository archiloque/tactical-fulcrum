import { DBSchema, deleteDB, IDBPDatabase, openDB } from "idb"
import { Tile, TileType } from "../../common/models/tile"
import { PlayedTower } from "../models/played-tower"
import { PlayerInfo } from "../models/player-info"
import { Position3D } from "../models/tuples"

const TOWER_OBJECT_STORE = "tower"
const PLAYED_TOWER_OBJECT_STORE = "playedTower"
const PLAYED_TOWER_ROOM_OBJECT_STORE = "playedTowerRoom"

const enum TowerModelAttributes {
  id = "id",
  towerName = "towerName",
}

const enum PlayedTowerModelAttributes {
  id = "id",
  towerId = "towerId",
  slot = "slot",
  saveName = "saveName",
  timestamp = "timestamp",
}

const enum PlayedTowerRoomModelAttributes {
  id = "id",
  playerTowerId = "playerTowerId",
  roomIndex = "roomIndex",
  nexus = "nexus",
  content = "content",
}

export type PlayerPosition = {
  column: number
  line: number
  room: number
}

export type TowerModel = {
  id?: number
  towerName: string
}

export type PlayedTowerModel = {
  id?: number
  towerId: number
  slot: number
  saveName: string | null
  timestamp: Date
  playerPosition: PlayerPosition
  playerInfo: PlayerInfo
}

type PositionedTile = {
  line: number
  column: number
  tile: Tile
}

type PlayerTowerRoomModel = {
  id?: number
  playerTowerId: number
  roomIndex: number
  nexus: boolean
  content: PositionedTile[]
}

interface TacticalFulcrumGameDbSchema extends DBSchema {
  [TOWER_OBJECT_STORE]: {
    key: [number]
    value: TowerModel
    indexes: { name: [string] }
  }
  [PLAYED_TOWER_OBJECT_STORE]: {
    key: [number]
    value: PlayedTowerModel
    indexes: {
      primaryIndex: [number]
      playedTowerIndex: [number, number]
    }
  }
  [PLAYED_TOWER_ROOM_OBJECT_STORE]: {
    key: [number]
    value: PlayerTowerRoomModel
    indexes: { playedTowerRoomIndex: [number, number] }
  }
}

const CURRENT_PLAYED_TOWER_SLOT = -1

export class Database {
  static readonly DATABASE_NAME = "tactical-fulcrum-game"
  private db: undefined | IDBPDatabase<TacticalFulcrumGameDbSchema>

  constructor() {}

  async init(): Promise<any> {
    this.db = await openDB<TacticalFulcrumGameDbSchema>(Database.DATABASE_NAME, 1, {
      upgrade(database: IDBPDatabase<TacticalFulcrumGameDbSchema>) {
        const towerStore = database.createObjectStore(TOWER_OBJECT_STORE, {
          keyPath: TowerModelAttributes.id,
          autoIncrement: true,
        })
        towerStore.createIndex("name", [TowerModelAttributes.towerName], { unique: true })

        const playedTowerStore = database.createObjectStore(PLAYED_TOWER_OBJECT_STORE, {
          keyPath: PlayedTowerModelAttributes.id,
          autoIncrement: true,
        })
        playedTowerStore.createIndex("primaryIndex", [PlayedTowerModelAttributes.id], { unique: true })
        playedTowerStore.createIndex(
          "playedTowerIndex",
          [PlayedTowerModelAttributes.towerId, PlayedTowerModelAttributes.slot],
          { unique: true },
        )

        const playedTowerRoomStore = database.createObjectStore(PLAYED_TOWER_ROOM_OBJECT_STORE, {
          keyPath: PlayedTowerRoomModelAttributes.id,
          autoIncrement: true,
        })
        playedTowerRoomStore.createIndex("playedTowerRoomIndex", [
          PlayedTowerRoomModelAttributes.playerTowerId,
          PlayedTowerRoomModelAttributes.roomIndex,
        ])
      },
    })
  }

  async savePlayerTower(save: PlayedTowerModel): Promise<any> {
    await this.db!.put(PLAYED_TOWER_OBJECT_STORE, save)
  }

  async getTowerId(towerName: string): Promise<number> {
    const towerId = await this.db!.getKeyFromIndex(TOWER_OBJECT_STORE, "name", [towerName])
    if (towerId === undefined) {
      const tower: TowerModel = { towerName: towerName }
      return (await this.db!.put(TOWER_OBJECT_STORE, tower))[0]
    } else {
      return towerId[0]
    }
  }

  async currentPlayedTowerModelId(towerId: number): Promise<number | undefined> {
    const value = await this.db!.getKeyFromIndex(PLAYED_TOWER_OBJECT_STORE, "playedTowerIndex", [
      towerId,
      CURRENT_PLAYED_TOWER_SLOT,
    ])
    if (value === undefined) {
      return undefined
    } else {
      return value[0]
    }
  }

  async clear(): Promise<any> {
    await deleteDB(Database.DATABASE_NAME)
    return await this.init()
  }

  async toPlayedTowerModel(playedTower: PlayedTower, slot: number, saveName: string | null): Promise<PlayedTowerModel> {
    return {
      playerInfo: playedTower.playerInfo,
      playerPosition: {
        column: playedTower.playerPosition.column,
        line: playedTower.playerPosition.line,
        room: playedTower.playerPosition.room,
      },
      saveName: saveName,
      slot: slot,
      towerId: await this.getTowerId(playedTower.tower.name),
      timestamp: new Date(),
    }
  }

  async toCurrentPlayedTowerModel(playedTower: PlayedTower): Promise<PlayedTowerModel> {
    return await this.toPlayedTowerModel(playedTower, CURRENT_PLAYED_TOWER_SLOT, null)
  }

  private static readonly INTERESTING_TILES_TYPES: TileType[] = [
    TileType.door,
    TileType.enemy,
    TileType.item,
    TileType.key,
  ]

  private roomsToPositionedTiles(room: Tile[][]): PositionedTile[] {
    const tiles: PositionedTile[] = []
    for (const [lineIndex, line] of room.entries()) {
      for (const [columnIndex, tile] of line.entries()) {
        if (Database.INTERESTING_TILES_TYPES.includes(tile.type)) {
          tiles.push({ line: lineIndex, column: columnIndex, tile: tile })
        }
      }
    }
    return tiles
  }

  async initPlayedTower(playedTower: PlayedTower): Promise<any> {
    console.debug("Database", "initPlayedTower", playedTower.tower.name)
    const playedTowerId = (
      await this.db!.put(PLAYED_TOWER_OBJECT_STORE, await this.toCurrentPlayedTowerModel(playedTower))
    )[0]
    const promises: Promise<any>[] = []
    const transaction = this.db!.transaction(PLAYED_TOWER_ROOM_OBJECT_STORE, "readwrite")
    for (const [roomIndex, room] of playedTower.standardRooms.entries()) {
      const tiles: PositionedTile[] = this.roomsToPositionedTiles(room)
      promises.push(
        transaction.store.put({
          playerTowerId: playedTowerId,
          roomIndex: roomIndex,
          nexus: false,
          content: tiles,
        }),
      )
    }
    for (const [roomIndex, room] of playedTower.nexusRooms.entries()) {
      const tiles: PositionedTile[] = this.roomsToPositionedTiles(room)
      promises.push(
        transaction.store.put({
          playerTowerId: playedTowerId,
          roomIndex: roomIndex,
          nexus: true,
          content: tiles,
        }),
      )
    }
    await Promise.all(promises)
    await transaction.done
  }

  async setupPlayedTower(playedTower: PlayedTower, playedTowerId: number): Promise<void> {
    console.debug("Database", "setupPlayedTower", "playedTower", playedTower.tower.name, "playedTowerId", playedTowerId)
    const playedTowerModel: PlayedTowerModel = (await this.db!.getFromIndex(PLAYED_TOWER_OBJECT_STORE, "primaryIndex", [
      playedTowerId,
    ]))!
    console.debug("Database", "setupPlayedTower", "playedTowerModel", playedTowerModel)
    playedTower.playerPosition = new Position3D(
      playedTowerModel.playerPosition.room,
      playedTowerModel.playerPosition.line,
      playedTowerModel.playerPosition.column,
    )
    playedTower.playerInfo
  }
}
