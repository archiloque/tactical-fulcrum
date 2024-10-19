import { AlertVariant, showAlert } from "../../common/front/alert"
import { PlayedTowerModel, PlayerTowerRoomModel } from "./models"
import { Game } from "../game"
import { Import } from "../../common/io/import"
import { PlayedTowerTable } from "./tables/played-tower-table"
import { RoomTable } from "./tables/room-table"
import { RoomType } from "../../common/data/room-type"
import { runRequest } from "./utils"
import { TOWERS } from "../towers/towers"
import { TowerTable } from "./tables/tower-table"

export const enum TableName {
  tower = "tower",
  playedTower = "playedTower",
  playedTowerRoom = "playedTowerRoom",
}

export const enum IndexName {
  towerNameIndex = `${TableName.tower}NameIndex`,

  playedTowerByTowerName = `${TableName.playedTower}ByTowerName`,
  playedTowerByTowerNameAndSlot = `${TableName.playedTower}ByTowerNameAndSlot`,

  playedTowerRoomByPlayedTowerNameAndSlot = `${TableName.playedTowerRoom}ByPlayedTowerNameAndSlot`,
  playedTowerRoomByPlayedTowerNameAndSlotAndRoomAndNexusIndex = `${TableName.playedTowerRoom}ByPlayedTowerNameAndSlotAndRoomAndNexusIndex`,
}

const TOWER_NAME_ATTRIBUTE = "towerName"
const SLOT_ATTRIBUTE = "slot"

const enum TowerModelAttributes {
  towerName = TOWER_NAME_ATTRIBUTE,
}

const enum PlayedTowerModelAttributes {
  towerName = TOWER_NAME_ATTRIBUTE,
  slot = SLOT_ATTRIBUTE,
}

const enum PlayedTowerRoomModelAttributes {
  towerName = TOWER_NAME_ATTRIBUTE,
  slot = SLOT_ATTRIBUTE,
  roomIndex = "roomIndex",
  roomType = "roomType",
  content = "content",
}

interface TowerDump {
  saves: PlayedTowerDump[]
}

interface PlayedTowerDump {
  playedTower: PlayedTowerModel
  rooms: PlayerTowerRoomModel[]
}

function createTable(
  db: IDBDatabase,
  tableName: TableName,
  tableIndexName: IndexName,
  keyPath: string[],
): IDBObjectStore {
  console.debug("DatabaseAccess", "createTable", tableName)
  const store = db.createObjectStore(tableName, {
    keyPath: keyPath,
  })
  store.createIndex(tableIndexName, keyPath, { unique: true })
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
        createTable(db, TableName.tower, IndexName.towerNameIndex, [TowerModelAttributes.towerName])

        const playedTowerObjectStore = createTable(db, TableName.playedTower, IndexName.playedTowerByTowerNameAndSlot, [
          PlayedTowerModelAttributes.towerName,
          PlayedTowerModelAttributes.slot,
        ])
        playedTowerObjectStore.createIndex(IndexName.playedTowerByTowerName, [PlayedTowerModelAttributes.towerName], {
          unique: false,
        })

        const playedTowerRoomObjectStore = createTable(
          db,
          TableName.playedTowerRoom,
          IndexName.playedTowerRoomByPlayedTowerNameAndSlotAndRoomAndNexusIndex,
          [
            PlayedTowerRoomModelAttributes.towerName,
            PlayedTowerRoomModelAttributes.slot,
            PlayedTowerRoomModelAttributes.roomIndex,
            PlayedTowerRoomModelAttributes.roomType,
          ],
        )
        playedTowerRoomObjectStore.createIndex(
          IndexName.playedTowerRoomByPlayedTowerNameAndSlot,
          [PlayedTowerRoomModelAttributes.towerName, PlayedTowerRoomModelAttributes.slot],
          {
            unique: false,
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

  async dumpDb(): Promise<void> {
    const result: Record<string, TowerDump> = {}
    for (const tower of TOWERS) {
      const towerName = tower.name
      await Game.fetchTowerFile(tower).then(async (response) => {
        if (!response.ok) {
          console.error("DatabaseAccess", "dumpDb", response)
        } else {
          const importResult = new Import().import(await response.text())
          if (importResult.errors.length != 0) {
            console.error("DatabaseAccess", "dumpDb", importResult.errors)
          } else {
            const tower = importResult.tower
            const towerSaves: PlayedTowerDump[] = []
            for (const playedTowerModel of await this.getPlayedTowerTable().listByTowerName(towerName, false)) {
              const slot = playedTowerModel.slot
              const rooms = []
              const standardRooms = tower.getRooms(RoomType.standard).length
              for (let roomIndex = 0; roomIndex < standardRooms; roomIndex++) {
                rooms.push(await this.getRoomTable().get(towerName, slot, roomIndex, RoomType.standard))
              }
              const nexusRooms = tower.getRooms(RoomType.standard).length
              for (let roomIndex = 0; roomIndex < nexusRooms; roomIndex++) {
                rooms.push(await this.getRoomTable().get(towerName, slot, roomIndex, RoomType.nexus))
              }
              const towerSave = {
                playedTower: playedTowerModel,
                rooms: rooms,
              }
              towerSaves.push(towerSave)
            }
            const towerDump: TowerDump = {
              saves: towerSaves,
            }
            result[towerName] = towerDump
          }
        }
      })
    }
    console.debug("Dump ready!")
    console.debug(result)
  }
}
