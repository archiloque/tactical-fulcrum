import { ModelWithId } from "./models"

export interface DbModel {}

export async function runRequest(request: IDBRequest): Promise<any> {
  return new Promise<any>(function (resolve, reject) {
    request.onsuccess = (): void => {
      console.debug("storage/utils", "runRequest", request.result)
      resolve(request.result)
    }
    request.onerror = (): void => {
      console.error("storage/utils", "runRequest", request.error)
      debugger
      reject()
    }
  })
}

export class DbAccess<M extends ModelWithId> {
  private readonly store: IDBObjectStore

  constructor(store: IDBObjectStore) {
    this.store = store
  }

  async put(model: M): Promise<any> {
    console.debug("DbAccess", "put", this.store.name, model)
    await runRequest(this.store.put(model, model.id))
  }

  async add(model: M): Promise<any> {
    console.debug("DbAccess", "add", this.store.name, model)
    return await runRequest(this.store.add(model))
  }

  async all(): Promise<M[]> {
    console.debug("DbAccess", "all", this.store.name)
    return await runRequest(this.store.getAll())
  }

  index(name: string): DbIndex<M> {
    return new DbIndex<M>(this.store.index(name))
  }

  delete(id: number): void {
    this.store.delete(id)
  }
}

export class DbIndex<M extends DbModel> {
  private readonly index: IDBIndex

  constructor(index: IDBIndex) {
    this.index = index
  }

  async get(query: IDBValidKey | IDBKeyRange): Promise<M | undefined> {
    console.debug("DbIndex", "get", this.index.name, query)
    return await runRequest(this.index.get(query))
  }

  async getKey(query: IDBValidKey | IDBKeyRange): Promise<number | undefined> {
    console.debug("DbIndex", "getKey", this.index.name, query)
    return await runRequest(this.index.getKey(query))
  }

  async getAllKeys(query?: IDBValidKey | IDBKeyRange): Promise<number[]> {
    console.debug("DbIndex", "getAllKeys", this.index.name, query)
    return await runRequest(this.index.getAllKeys(query))
  }

  async getAll(query: IDBValidKey[] | null): Promise<M[]> {
    console.debug("DbIndex", "getAll", this.index.name, query)
    return await runRequest(this.index.getAll(query))
  }
}
