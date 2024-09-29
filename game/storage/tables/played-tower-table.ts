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

  async getCurrent(towerName: string): Promise<PlayedTowerModel | undefined> {
    console.debug("PlayedTowerTable", "getCurrent", towerName)
    const store: DbAccess<PlayedTowerModel> = this.transaction("readonly")
    const index: DbIndex<PlayedTowerModel> = store.index(IndexName.playedTowerByTowerNameAndSlot)
    return await index.get([towerName, PlayedTowerTable.CURRENT_PLAYED_TOWER_SLOT])
  }

  private toModel(playedTower: PlayedTower, saveName: string | null, slot: number): PlayedTowerModel {
    const playerPosition = playedTower.position!!
    const result: PlayedTowerModel = {
      towerName: playedTower.tower.name,
      playerInfo: playedTower.playerInfo,
      position: {
        standard: playerPosition.standard,
        nexus: playerPosition.nexus,
        roomType: playerPosition.roomType!!,
      },
      saveName: saveName,
      slot: slot,
      timestamp: new Date(),
    }
    return result
  }

  private toModelCurrent(playedTower: PlayedTower): PlayedTowerModel {
    return this.toModel(playedTower, null, PlayedTowerTable.CURRENT_PLAYED_TOWER_SLOT)
  }

  async saveToCurrentSave(playedTower: PlayedTower): Promise<any> {
    console.debug("PlayedTowerTable", "saveToCurrentSave", playedTower.tower.name)
    const playedTowerModel = this.toModelCurrent(playedTower)
    const store: DbAccess<PlayedTowerModel> = this.transaction("readwrite")
    await store.put(playedTowerModel)
  }

  async saveNew(playedTower: PlayedTower, saveName: string): Promise<any> {
    console.debug("PlayedTowerTable", "saveNew", saveName)
    const slot = await this.nextSlot(playedTower.tower.name)
    const playedTowerModel = this.toModel(playedTower, saveName, slot)
    const towerModelStore: DbAccess<PlayedTowerModel> = this.transaction("readwrite")
    await towerModelStore.add(playedTowerModel)
    await this.roomTable.saveRooms(playedTower, slot)
  }

  async saveOverwrite(playedTower: PlayedTower, slot: number, saveName: string): Promise<any> {
    console.debug("PlayedTowerTable", "saveOverwrite", playedTower, slot, saveName)
    const playedTowerModel = this.toModel(playedTower, saveName, slot)
    const towerModelStore: DbAccess<PlayedTowerModel> = this.transaction("readwrite")
    await towerModelStore.put(playedTowerModel)
    await this.roomTable.saveRooms(playedTower, slot)
  }

  private async nextSlot(towerName: string): Promise<number> {
    console.debug("PlayedTowerTable", "nextSlot", towerName)
    const store: DbAccess<PlayedTowerModel> = this.transaction("readonly")
    const playedTowerModels: PlayedTowerModel[] = await store
      .index(IndexName.playedTowerByTowerName)
      .getAll([towerName])
    let maxSlot: undefined | number = undefined
    for (const playedTowerModel of playedTowerModels) {
      if (playedTowerModel.slot === PlayedTowerTable.CURRENT_PLAYED_TOWER_SLOT) {
      } else if (maxSlot === undefined) {
        maxSlot = playedTowerModel.slot
      } else if (playedTowerModel.slot > maxSlot) {
        maxSlot = playedTowerModel.slot
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
    await playedTowerModelStore.put(playedTowerModel)

    await this.roomTable.deleteRooms(playedTower.tower.name, PlayedTowerTable.CURRENT_PLAYED_TOWER_SLOT)
    await this.roomTable.saveRooms(playedTower, PlayedTowerTable.CURRENT_PLAYED_TOWER_SLOT)
  }

  async load(playedTower: PlayedTower, playedTowerModel: PlayedTowerModel): Promise<void> {
    console.debug("PlayedTowerTable", "load", playedTowerModel)

    playedTower.playerInfo = playedTowerModel.playerInfo

    const position = playedTowerModel.position
    playedTower.position = new PlayerPosition(position.standard, position.nexus, position.roomType)

    playedTower.currentRoom = await this.roomTable.load(
      playedTower,
      PlayedTowerTable.CURRENT_PLAYED_TOWER_SLOT,
      position.roomType,
      position.roomType === RoomType.nexus ? position.nexus.room : position.standard.room,
    )
    playedTower.calculateReachableTiles()
  }

  async listByTowerName(towerName: string): Promise<PlayedTowerModel[]> {
    console.debug("PlayedTowerTable", "listByTowerName", towerName)
    const store: DbAccess<PlayedTowerModel> = this.transaction("readonly")
    const index = store.index(IndexName.playedTowerByTowerName)
    const playedTowerModels = (await index.getAll([towerName])).filter(
      (playedTowerModel) => playedTowerModel.slot != PlayedTowerTable.CURRENT_PLAYED_TOWER_SLOT,
    )
    playedTowerModels.sort((ptm1, ptm2) => ptm1.slot - ptm2.slot)
    return playedTowerModels
  }
}
