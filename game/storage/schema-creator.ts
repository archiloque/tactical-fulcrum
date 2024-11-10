import { Indexes, TableName } from "./database-constants"

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

const enum ActionModelAttributes {
  towerName = TOWER_NAME_ATTRIBUTE,
  slot = SLOT_ATTRIBUTE,
  actionIndex = "actionIndex",
}

function createTable<I extends keyof Indexes>(
  db: IDBDatabase,
  tableName: TableName,
  tableIndexName: I,
  keyPath: string[],
): IDBObjectStore {
  console.debug("DatabaseAccess", "createTable", tableName)
  const store = db.createObjectStore(tableName, {
    keyPath: keyPath,
  })
  store.createIndex(tableIndexName, keyPath, { unique: true })
  return store
}

function createTowerRoomTable(db: IDBDatabase): void {
  const playedTowerRoomObjectStore = createTable(
    db,
    TableName.playedTowerRoom,
    "playedTowerRoomByPlayedTowerNameAndSlotAndRoomAndNexusIndex",
    [
      PlayedTowerRoomModelAttributes.towerName,
      PlayedTowerRoomModelAttributes.slot,
      PlayedTowerRoomModelAttributes.roomIndex,
      PlayedTowerRoomModelAttributes.roomType,
    ],
  )
  playedTowerRoomObjectStore.createIndex(
    "playedTowerRoomByPlayedTowerNameAndSlot",
    [PlayedTowerRoomModelAttributes.towerName, PlayedTowerRoomModelAttributes.slot],
    {
      unique: false,
    },
  )
}

function createPlayerTowerTable(db: IDBDatabase): void {
  const playedTowerObjectStore = createTable(db, TableName.playedTower, "playedTowerByTowerNameAndSlot", [
    PlayedTowerModelAttributes.towerName,
    PlayedTowerModelAttributes.slot,
  ])
  playedTowerObjectStore.createIndex("playedTowerByTowerName", [PlayedTowerModelAttributes.towerName], {
    unique: false,
  })
}

function createActionTable(db: IDBDatabase): void {
  const actionObjectStore = createTable(db, TableName.action, "actionByPlayedTowerNameAndSlotAndIndex", [
    ActionModelAttributes.towerName,
    ActionModelAttributes.slot,
    ActionModelAttributes.actionIndex,
  ])

  actionObjectStore.createIndex(
    "actionByPlayedTowerNameAndSlot",
    [ActionModelAttributes.towerName, ActionModelAttributes.slot],
    { unique: false },
  )
}

function createTowerTable(db: IDBDatabase): void {
  createTable(db, TableName.tower, "towerNameIndex", [TowerModelAttributes.towerName])
}

export function createSchema(db: IDBDatabase): void {
  createTowerTable(db)
  createPlayerTowerTable(db)
  createTowerRoomTable(db)
  createActionTable(db)
}
