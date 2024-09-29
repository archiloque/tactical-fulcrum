import { DbAccess, DbIndex } from "../utils"
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
    const store: DbAccess<PlayedTowerModel> = this.transaction("readonly")
    const index: DbIndex<PlayedTowerModel> = store.index(IndexName.playedTowerByTowerIdAndSlot)
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
    console.debug("PlayedTowerTable", "saveToCurrentSave", playedTower.playedTowerModelCurrentSaveId)
    const playedTowerModel = this.toModelCurrent(playedTower)
    playedTowerModel.id = playedTower.playedTowerModelCurrentSaveId
    const store: DbAccess<PlayedTowerModel> = this.transaction("readwrite")
    await store.put(playedTowerModel)
  }

  async saveNew(playedTower: PlayedTower, saveName: string): Promise<any> {
    console.debug("PlayedTowerTable", "saveNew", saveName)
    const slot = await this.nextSlot(playedTower.towerModelId)
    const playedTowerModel = this.toModel(playedTower, saveName, slot)
    const towerModelStore: DbAccess<PlayedTowerModel> = this.transaction("readwrite")
    const playedTowerModelId = await towerModelStore.add(playedTowerModel)
    console.debug("PlayedTowerTable", "saveNew", saveName, playedTowerModelId)
    await this.roomTable.saveRooms(playedTower, playedTowerModelId)
  }

  async saveOverwrite(playedTower: PlayedTower, slot: number, saveName: string): Promise<any> {
    console.debug("PlayedTowerTable", "saveOverwrite", playedTower, slot, saveName)
    const playedTowerModel = this.toModel(playedTower, saveName, slot)
    const possiblePlayedTowerId = await this.findIdForSlot(playedTower.towerModelId, slot)
    const towerModelStore: DbAccess<PlayedTowerModel> = this.transaction("readwrite")
    if (possiblePlayedTowerId === undefined) {
      const playedTowerModelId = await towerModelStore.add(playedTowerModel)
      await this.roomTable.saveRooms(playedTower, playedTowerModelId)
    } else {
      playedTowerModel.id = possiblePlayedTowerId
      debugger
      await towerModelStore.put(playedTowerModel)
      await this.roomTable.saveRooms(playedTower, possiblePlayedTowerId)
    }
  }

  private async nextSlot(towerModelId: number): Promise<number> {
    console.debug("PlayedTowerTable", "nextSlot", towerModelId)
    const store: DbAccess<PlayedTowerModel> = this.transaction("readonly")
    const playedTowerModels: PlayedTowerModel[] = await store
      .index(IndexName.playedTowerByTowerId)
      .getAll([towerModelId])
    let maxSlot: undefined | number = undefined
    for (const playedTowerModel of playedTowerModels) {
      if (playedTowerModel.slot !== PlayedTowerTable.CURRENT_PLAYED_TOWER_SLOT) {
        if (maxSlot === undefined) {
          maxSlot = playedTowerModel.slot
        } else if (playedTowerModel.slot > maxSlot) {
          maxSlot = playedTowerModel.slot
        }
      }
    }
    if (maxSlot === undefined) {
      console.debug("PlayedTowerTable", "nextSlot", "no save found, slot is 0")
      return 0
    } else {
      console.debug("PlayedTowerTable", "nextSlot", maxSlot + 1)
      return maxSlot + 1
    }
  }

  async init(playedTower: PlayedTower): Promise<void> {
    console.debug("PlayedTowerTable", "init", playedTower.tower.name)
    const playedTowerModel = this.toModelCurrent(playedTower)
    const playedTowerModelStore: DbAccess<PlayedTowerModel> = this.transaction("readwrite")

    if (playedTower.playedTowerModelCurrentSaveId === undefined) {
      const playedTowerModelId: number = await playedTowerModelStore.add(playedTowerModel)
      playedTower.playedTowerModelCurrentSaveId = playedTowerModelId
    } else {
      await playedTowerModelStore.put(playedTowerModel)
      await this.roomTable.deleteRooms(playedTower.playedTowerModelCurrentSaveId)
    }

    await this.roomTable.saveRooms(playedTower, playedTower.playedTowerModelCurrentSaveId)
  }

  async load(playedTower: PlayedTower, playedTowerModelId: number): Promise<void> {
    console.debug("PlayedTowerTable", "load", playedTowerModelId)
    playedTower.playedTowerModelCurrentSaveId = playedTowerModelId
    const store: DbAccess<PlayedTowerModel> = this.transaction("readonly")
    const index = store.index(IndexName.playedTowerIdIndex)
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

  async listByTowerModelId(towerModelId: number): Promise<PlayedTowerModel[]> {
    console.debug("PlayedTowerTable", "list", towerModelId)
    const store: DbAccess<PlayedTowerModel> = this.transaction("readonly")
    const index = store.index(IndexName.playedTowerByTowerId)
    const playedTowerModels = (await index.getAll([towerModelId])).filter(
      (playedTowerModel) => playedTowerModel.slot != PlayedTowerTable.CURRENT_PLAYED_TOWER_SLOT,
    )
    playedTowerModels.sort((ptm1, ptm2) => ptm1.slot - ptm2.slot)
    return playedTowerModels
  }

  async findIdForSlot(towerModelId: number, slot: number): Promise<undefined | number> {
    console.debug("PlayedTowerTable", "findIdForSlot", towerModelId, slot)
    const store: DbAccess<PlayedTowerModel> = this.transaction("readonly")
    const index = store.index(IndexName.playedTowerByTowerIdAndSlot)
    const playedTowerModel: PlayedTowerModel | undefined = await index.get([towerModelId, slot])
    return playedTowerModel === undefined ? undefined : playedTowerModel.slot
  }
}
