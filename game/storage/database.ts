import { DBSchema, deleteDB, IDBPDatabase, openDB } from "idb"
import { PlayedTower } from "../models/played-tower"
import { PlayerInfo } from "../models/player-info"

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

export type PlayerPosition = {
  column: number
  line: number
  room: number
}

export type TowerModel = {
  id: number
  towerName: string
}

export type PlayedTowerModel = {
  id: number
  tower: number
  slot: number
  saveName: string | null
  timestamp: Date
  playerPosition: PlayerPosition
  playerInfo: PlayerInfo
}

interface TacticalFulcrumGameDbSchema extends DBSchema {
  [Database.TOWER_OBJECT_STORE]: {
    key: [number]
    value: TowerModel
    indexes: { name: [string] }
  }
  [Database.PLAYED_TOWER_OBJECT_STORE]: {
    key: [number, string]
    value: PlayedTowerModel
    indexes: { identifier: [number, number] }
  }
}

export class Database {
  static readonly DATABASE_NAME = "tactical-fulcrum-game"
  static readonly TOWER_OBJECT_STORE = "tower"
  static readonly PLAYED_TOWER_OBJECT_STORE = "playedTower"
  private db: undefined | IDBPDatabase<TacticalFulcrumGameDbSchema>

  constructor() {}

  async init(): Promise<any> {
    this.db = await openDB<TacticalFulcrumGameDbSchema>(Database.DATABASE_NAME, 1, {
      upgrade(database: IDBPDatabase<TacticalFulcrumGameDbSchema>) {
        const towerStore = database.createObjectStore(Database.TOWER_OBJECT_STORE, {
          keyPath: TowerModelAttributes.id,
          autoIncrement: true,
        })
        towerStore.createIndex("name", [TowerModelAttributes.towerName])

        const playedTowerStore = database.createObjectStore(Database.PLAYED_TOWER_OBJECT_STORE, {
          keyPath: PlayedTowerModelAttributes.id,
          autoIncrement: true,
        })
        playedTowerStore.createIndex("identifier", [
          PlayedTowerModelAttributes.towerId,
          PlayedTowerModelAttributes.slot,
        ])
      },
    })
  }

  async savePlayerTower(save: PlayedTowerModel): Promise<any> {
    await this.db!.put(Database.PLAYED_TOWER_OBJECT_STORE, save)
  }

  async getTowerId(towerName: string): Promise<any> {
    const tower = await this.db!.getFromIndex(Database.TOWER_OBJECT_STORE, "name", [towerName])
    if (tower === undefined) {
      // @ts-ignore
      const tower: TowerModel = { towerName: towerName }
      return (await this.db!.put(Database.TOWER_OBJECT_STORE, tower))[0]
    } else {
      return tower.id
    }
  }

  async clear(): Promise<any> {
    await deleteDB(Database.DATABASE_NAME)
    return await this.init()
  }

  async toPlayedTowerModel(playedTower: PlayedTower, slot: number, saveName: string | null): Promise<PlayedTowerModel> {
    // @ts-ignore
    return {
      playerInfo: playedTower.playerInfo,
      playerPosition: {
        column: playedTower.playerPosition.column,
        line: playedTower.playerPosition.line,
        room: playedTower.playerPosition.room,
      },
      saveName: saveName,
      slot: slot,
      tower: await this.getTowerId(playedTower.tower.name),
      timestamp: new Date(),
    }
  }

  async toCurrentSave(playedTower: PlayedTower): Promise<PlayedTowerModel> {
    return await this.toPlayedTowerModel(playedTower, -1, null)
  }
}
