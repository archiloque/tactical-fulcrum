import { IndexName, TableName } from "../database-constants"
import { Table } from "./table"
import { TowerModel } from "../models"

export class TowerTable extends Table<TowerModel> {
  constructor(db: IDBDatabase) {
    super(db, TableName.tower)
  }

  async insertIfMissing(towerName: string): Promise<void> {
    console.debug("TowerTable", "insertIfMissing", towerName)
    const store = this.transaction("readwrite")
    const index = store.index(IndexName.towerNameIndex)
    const towerModel: TowerModel | undefined = await index.get([towerName])
    if (towerModel === undefined) {
      const tower: TowerModel = { towerName: towerName }
      console.debug("TowerTable", "insertIfMissing", "create tower")
      await store.add(tower)
    }
  }
}
