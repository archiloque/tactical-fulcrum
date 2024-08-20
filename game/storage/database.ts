import { DBSchema, deleteDB, IDBPDatabase, openDB } from "idb"
import { PlayedTower } from "../models/played-tower"
import { PlayerInfo } from "../models/player-info"

const enum SaveAttributes {
  towerName = "towerName",
  slot = "slot",
  saveName = "saveName",
  timestamp = "timestamp",
}

export type PlayerPosition = {
  column: number
  line: number
  room: number
}

export type Save = {
  towerName: string
  slot: number
  saveName: string | null
  timestamp: Date
  playerPosition: PlayerPosition
  playerInfo: PlayerInfo
}

interface TacticalFulcrumGameDbSchema extends DBSchema {
  save: {
    key: [number, string]
    value: Save
    indexes: { identifier: [SaveAttributes.towerName, SaveAttributes.slot] }
  }
}

export class Database {
  static readonly DATABASE_NAME = "tactical-fulcrum-game"
  static readonly SAVE_OBJECT_STORE = "save"
  private db: undefined | IDBPDatabase<TacticalFulcrumGameDbSchema>

  constructor() {}

  async init(): Promise<any> {
    this.db = await openDB<TacticalFulcrumGameDbSchema>(Database.DATABASE_NAME, 1, {
      upgrade(database: IDBPDatabase<TacticalFulcrumGameDbSchema>) {
        const store = database.createObjectStore(Database.SAVE_OBJECT_STORE, {
          keyPath: [SaveAttributes.towerName, SaveAttributes.slot],
          autoIncrement: false,
        })
        store.createIndex("identifier", [SaveAttributes.towerName, SaveAttributes.slot])
      },
    })
  }

  async save(save: Save): Promise<any> {
    await this.db!.put(Database.SAVE_OBJECT_STORE, save)
  }

  async clear(): Promise<any> {
    await deleteDB(Database.DATABASE_NAME)
    return await this.init()
  }

  toSave(playedTower: PlayedTower, slot: number, saveName: string | null): Save {
    return {
      playerInfo: playedTower.playerInfo,
      playerPosition: {
        column: playedTower.playerPosition.column,
        line: playedTower.playerPosition.line,
        room: playedTower.playerPosition.room,
      },
      saveName: saveName,
      slot: slot,
      towerName: playedTower.tower.name,
      timestamp: new Date(),
    }
  }

  toCurrentSave(playedTower: PlayedTower): Save {
    return this.toSave(playedTower, -1, null)
  }
}
