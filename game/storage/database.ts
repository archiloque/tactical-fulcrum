import { AlertVariant, showAlert } from "../../common/front/alert"
import { ActionTable } from "./tables/action-table"
import { createSchema } from "./schema-creator"
import { PlayedTowerTable } from "./tables/played-tower-table"
import { RoomTable } from "./tables/room-table"
import { runRequest } from "./utils"
import { TowerTable } from "./tables/tower-table"

export class DatabaseAccess {
  static readonly DATABASE_NAME = "tactical-fulcrum-game"
  private db: undefined | IDBDatabase

  constructor() {}

  async init(): Promise<void> {
    const databaseAccess = this
    return new Promise<void>(function (resolve, reject) {
      const request = window.indexedDB.open(DatabaseAccess.DATABASE_NAME, 2)
      request.onupgradeneeded = (event: IDBVersionChangeEvent): void => {
        // @ts-ignore
        const db: IDBDatabase = event.target!.result
        createSchema(db)
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

  public getTowerTable(): TowerTable {
    return new TowerTable(this.db!!)
  }

  public getPlayedTowerTable(): PlayedTowerTable {
    return new PlayedTowerTable(this.db!!, new RoomTable(this.db!!))
  }

  public getRoomTable(): RoomTable {
    return new RoomTable(this.db!!)
  }

  public getActionTable(): ActionTable {
    return new ActionTable(this.db!!)
  }

  async clear(): Promise<void> {
    this.db = undefined
    await runRequest(window.indexedDB.deleteDatabase(DatabaseAccess.DATABASE_NAME))
    return await this.init()
  }
}
