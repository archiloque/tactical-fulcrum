import { DatabaseAccessIndex, DatabaseAccessStore } from "../utils"
import { IndexName, TableName } from "../database"
import { PlayedTower } from "../../models/played-tower"
import { PlayedTowerModel } from "../models"
import { PlayerPosition } from "../../models/player-position"
import { RoomTable } from "./room-table"
import { RoomType } from "../../../common/data/room-type"
import { Table } from "./table"

export class PlayedTowerTable extends Table<PlayedTowerModel> {
  static CURRENT_PLAYED_TOWER_SLOT = -1

  private readonly roomTable: RoomTable

  public constructor(db: IDBDatabase, roomTable: RoomTable) {
    super(db, TableName.playedTower)
    this.roomTable = roomTable
  }

  async getCurrentId(towerId: number): Promise<number | undefined> {
    console.debug("PlayedTowerTable", "getCurrentId", towerId)
    const store: DatabaseAccessStore<PlayedTowerModel> = this.createTransaction("readonly")
    const index: DatabaseAccessIndex<PlayedTowerModel> = store.index(IndexName.playedTowerByTowerIdAndSlot)
    return await index.getKey([towerId, PlayedTowerTable.CURRENT_PLAYED_TOWER_SLOT])
  }

  private toModel(playedTower: PlayedTower, saveName: string | null, slot: number): PlayedTowerModel {
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
    return result
  }

  private toModelCurrent(playedTower: PlayedTower): PlayedTowerModel {
    const playedTowerModel = this.toModel(playedTower, null, PlayedTowerTable.CURRENT_PLAYED_TOWER_SLOT)
    playedTowerModel.id = playedTower.towerModelId
    return playedTowerModel
  }

  async saveToCurrentSave(playedTower: PlayedTower): Promise<any> {
    console.debug("PlayedTowerTable", "saveToCurrentSave", playedTower.playedTowerModelCurentSaveId)
    const playedTowerModel = this.toModelCurrent(playedTower)
    playedTowerModel.id = playedTower.playedTowerModelCurentSaveId
    const store: DatabaseAccessStore<PlayedTowerModel> = this.createTransaction("readwrite")
    await store.put(playedTowerModel)
  }

  async saveNew(playedTower: PlayedTower, saveName: string): Promise<any> {
    console.debug("PlayedTowerTable", "saveNew", saveName)
    const slotId = await this.nextSlotId(playedTower.towerModelId)
    const playedTowerModel = this.toModel(playedTower, saveName, slotId)
    const towerModelStore: DatabaseAccessStore<PlayedTowerModel> = this.createTransaction("readwrite")
    const playedTowerModelId = await towerModelStore.add(playedTowerModel)
    console.debug("PlayedTowerTable", "playedTowerSaveNew", saveName, playedTowerModelId)
    await this.roomTable.saveRooms(playedTower, playedTowerModelId)
  }

  private async nextSlotId(towerModelId: number): Promise<number> {
    console.debug("PlayedTowerTable", "nextSlotId", towerModelId)
    const playedTowerRoomStore: DatabaseAccessStore<PlayedTowerModel> = this.createTransaction("readonly")
    const playedTowerModels: PlayedTowerModel[] = await playedTowerRoomStore
      .index(IndexName.playedTowerByTowerId)
      .getAll([towerModelId])
    let maxSlotId: undefined | number = undefined
    for (const playedTowerModel of playedTowerModels) {
      if (playedTowerModel.slot !== PlayedTowerTable.CURRENT_PLAYED_TOWER_SLOT) {
        if (maxSlotId === undefined) {
          maxSlotId = playedTowerModel.slot
        } else if (playedTowerModel.slot > maxSlotId) {
          maxSlotId = playedTowerModel.slot
        }
      }
    }
    if (maxSlotId === undefined) {
      console.debug("PlayedTowerTable", "nextSlotId", "no save found, slot is 0")
      return 0
    } else {
      console.debug("PlayedTowerTable", "nextSlotId", maxSlotId + 1)
      return maxSlotId + 1
    }
  }

  async init(playedTower: PlayedTower): Promise<void> {
    console.debug("PlayedTowerTable", "init", playedTower.tower.name)
    const playedTowerModel = this.toModelCurrent(playedTower)
    const playedTowerModelStore: DatabaseAccessStore<PlayedTowerModel> = this.createTransaction("readwrite")

    if (playedTower.playedTowerModelCurentSaveId === undefined) {
      const playedTowerModelId: number = await playedTowerModelStore.add(playedTowerModel)
      playedTower.playedTowerModelCurentSaveId = playedTowerModelId
    } else {
      await playedTowerModelStore.put(playedTowerModel)
      await this.roomTable.deleteRooms(playedTower.playedTowerModelCurentSaveId)
    }

    await this.roomTable.saveRooms(playedTower, playedTower.playedTowerModelCurentSaveId)
  }

  async load(playedTower: PlayedTower, playedTowerModelId: number): Promise<void> {
    console.debug("PlayedTowerTable", "loadPlayedTower", playedTowerModelId)
    playedTower.playedTowerModelCurentSaveId = playedTowerModelId
    const playedTowerStore: DatabaseAccessStore<PlayedTowerModel> = this.createTransaction("readonly")
    const index = playedTowerStore.index(IndexName.playedTowerIdIndex)
    const playedTowerModel = (await index.get(playedTowerModelId))!!
    console.debug("PlayedTowerTable", "loadPlayedTower", playedTowerModel)

    playedTower.playerInfo = playedTowerModel.playerInfo

    const position = playedTowerModel.position
    playedTower.position = new PlayerPosition(position.standard, position.nexus, position.roomType)

    playedTower.currentRoom = await this.roomTable.load(
      playedTower,
      position.roomType,
      position.roomType === RoomType.nexus ? position.nexus.room : position.standard.room,
    )
    playedTower.calculateReachableTiles()
  }
}
