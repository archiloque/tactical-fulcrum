import { DbAccess, DbModel } from "../utils"

export abstract class Table<M extends DbModel> {
  private readonly db: IDBDatabase
  private readonly tableName: string

  public constructor(db: IDBDatabase, tableName: string) {
    this.db = db
    this.tableName = tableName
  }

  protected transaction(mode: IDBTransactionMode): DbAccess<M> {
    const transaction = this.db!.transaction(this.tableName, mode)
    return new DbAccess<M>(transaction.objectStore(this.tableName))
  }
}
