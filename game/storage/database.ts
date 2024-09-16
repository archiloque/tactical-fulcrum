import { AlertVariant, showAlert } from "../../common/front/alert"
import { PlayedTowerTable } from "./tables/played-tower-table"
import { RoomTable } from "./tables/room-table"
import { runRequest } from "./utils"
import { TowerTable } from "./tables/tower-table"

export const enum TableName {
  tower = "tower",
  playedTower = "playedTower",
  playedTowerRoom = "playedTowerRoom",
}

export const enum IndexName {
  towerIdIndex = `${TableName.tower}IdIndex`,

  towerNameIndex = `${TableName.tower}NameIndex`,

  playedTowerIdIndex = `${TableName.playedTower}IdIndex`,
  playedTowerByTowerId = `${TableName.playedTower}ByTowerId`,
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
      request.onupgradeneeded = (event: IDBVersionChangeEvent): void => {
        // @ts-ignore
        const db: IDBDatabase = event.target!.result
        const towerObjectStore = createTable(db, TableName.tower, IndexName.towerIdIndex)
        towerObjectStore.createIndex(IndexName.towerNameIndex, TowerModelAttributes.towerName, { unique: true })

        const playedTowerObjectStore = createTable(db, TableName.playedTower, IndexName.playedTowerIdIndex)
        playedTowerObjectStore.createIndex(IndexName.playedTowerByTowerId, [PlayedTowerModelAttributes.towerId], {
          unique: false,
        })

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

  public getTowerTable(): TowerTable {
    return new TowerTable(this.db!!)
  }

  public getPlayedTowerTable(): PlayedTowerTable {
    return new PlayedTowerTable(this.db!!, new RoomTable(this.db!!))
  }

  public getRoomTable(): RoomTable {
    return new RoomTable(this.db!!)
  }

  async clear(): Promise<void> {
    this.db = undefined
    await runRequest(window.indexedDB.deleteDatabase(DatabaseAccess.DATABASE_NAME))
    return await this.init()
  }
}
