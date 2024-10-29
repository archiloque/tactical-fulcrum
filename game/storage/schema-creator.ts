import { IndexName, TableName } from "./database-constants"

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

function createTowerRoomTable(db: IDBDatabase): void {
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

function createPlayerTowerTable(db: IDBDatabase): void {
  const playedTowerObjectStore = createTable(db, TableName.playedTower, IndexName.playedTowerByTowerNameAndSlot, [
    PlayedTowerModelAttributes.towerName,
    PlayedTowerModelAttributes.slot,
  ])
  playedTowerObjectStore.createIndex(IndexName.playedTowerByTowerName, [PlayedTowerModelAttributes.towerName], {
    unique: false,
  })
}

function createActionTable(db: IDBDatabase): void {
  const actionObjectStore = createTable(db, TableName.action, IndexName.actionByPlayedTowerNameAndSlotAndIndex, [
    ActionModelAttributes.towerName,
    ActionModelAttributes.slot,
    ActionModelAttributes.actionIndex,
  ])

  actionObjectStore.createIndex(
    IndexName.actionByPlayedTowerNameAndSlot,
    [ActionModelAttributes.towerName, ActionModelAttributes.slot],
    { unique: false },
  )
}

function createTowerTable(db: IDBDatabase): void {
  createTable(db, TableName.tower, IndexName.towerNameIndex, [TowerModelAttributes.towerName])
}

export function createSchema(db: IDBDatabase): void {
  createTowerTable(db)
  createPlayerTowerTable(db)
  createTowerRoomTable(db)
  createActionTable(db)
}
