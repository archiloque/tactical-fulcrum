import { Action } from "../../models/play/action"
import { ActionModel } from "../database-constants"
import { DbAccess } from "../utils"
import { PlayedTower } from "../../models/played-tower"
import { PlayedTowerTable } from "./played-tower-table"
import { Table } from "./table"
import { TableName } from "../database-constants"

export class ActionTable extends Table<ActionModel> {
  constructor(db: IDBDatabase) {
    super(db, TableName.action)
  }

  public async addToCurrentSave(playedTower: PlayedTower, action: Action): Promise<void> {
    console.debug("ActionTable", "addToCurrentSave", playedTower.tower.name, action)
    const actionModel: ActionModel = {
      action: action,
      actionIndex: playedTower.currentActionIndex,
      slot: PlayedTowerTable.CURRENT_PLAYED_TOWER_SLOT,
      towerName: playedTower.tower.name,
    }
    const store: DbAccess<ActionModel> = this.transaction("readwrite")
    await store.put(actionModel)
  }
}
