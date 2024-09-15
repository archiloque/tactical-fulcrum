import { IndexName, TableName } from "../database"
import { Table } from "./table"
import { TowerModel } from "../models"

export class TowerTable extends Table<TowerModel> {
  constructor(db: IDBDatabase) {
    super(db, TableName.tower)
  }

  async getIdFromName(towerName: string): Promise<number> {
    console.debug("TowerTable", "getIdFromName", towerName)
    const store = this.transaction("readwrite")
    const index = store.index(IndexName.towerNameIndex)
    const towerModelId: number | undefined = await index.getKey(towerName)
    if (towerModelId === undefined) {
      const tower: TowerModel = { towerName: towerName }
      console.debug("TowerTable", "getTowerId", "create tower")
      return await store.add(tower)
    } else {
      return towerModelId!!
    }
  }
}
