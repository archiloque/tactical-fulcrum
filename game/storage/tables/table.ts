import { DatabaseAccessStore, DatabaseModel } from "../utils"

export abstract class Table<M extends DatabaseModel> {
  private readonly db: IDBDatabase
  private readonly tableName: string

  public constructor(db: IDBDatabase, tableName: string) {
    this.db = db
    this.tableName = tableName
  }

  protected createTransaction(mode: IDBTransactionMode): DatabaseAccessStore<M> {
    const transaction = this.db!.transaction(this.tableName, mode)
    return new DatabaseAccessStore<M>(transaction.objectStore(this.tableName))
  }
}
