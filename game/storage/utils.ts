export interface DatabaseModel {}

export async function runRequest(request: IDBRequest): Promise<any> {
  return new Promise<any>(function (resolve, reject) {
    request.onsuccess = (): void => {
      console.debug("DatabaseAccess", "runRequest", request.result)
      resolve(request.result)
    }
    request.onerror = (): void => {
      console.error("DatabaseAccess", "runRequest", request.error)
      reject()
    }
  })
}

export class DatabaseAccessStore<M extends DatabaseModel> {
  private readonly store: IDBObjectStore

  constructor(store: IDBObjectStore) {
    this.store = store
  }

  async put(model: M): Promise<any> {
    console.debug("DatabaseAccessStore", "put", this.store.name, model)
    await runRequest(this.store.put(model))
  }

  async add(model: M): Promise<any> {
    console.debug("DatabaseAccessStore", "add", this.store.name, model)
    return await runRequest(this.store.add(model))
  }

  async all(): Promise<M[]> {
    console.debug("DatabaseAccessStore", "all", this.store.name)
    return await runRequest(this.store.getAll())
  }

  index(name: string): DatabaseAccessIndex<M> {
    return new DatabaseAccessIndex<M>(this.store.index(name))
  }

  delete(id: number): void {
    this.store.delete(id)
  }
}

export class DatabaseAccessIndex<M extends DatabaseModel> {
  private readonly index: IDBIndex

  constructor(index: IDBIndex) {
    this.index = index
  }

  async get(query: IDBValidKey | IDBKeyRange): Promise<M | undefined> {
    console.debug("DatabaseAccessIndex", "get", this.index.name, query)
    return await runRequest(this.index.get(query))
  }

  async getKey(query: IDBValidKey | IDBKeyRange): Promise<number | undefined> {
    console.debug("DatabaseAccessIndex", "getKey", this.index.name, query)
    return await runRequest(this.index.getKey(query))
  }

  async getAllKeys(query?: IDBValidKey | IDBKeyRange): Promise<number[]> {
    console.debug("DatabaseAccessIndex", "getAllKeys", this.index.name, query)
    return await runRequest(this.index.getAllKeys(query))
  }

  async getAll(query?: IDBValidKey | IDBKeyRange | null): Promise<M[]> {
    console.debug("DatabaseAccessIndex", "getAll", this.index.name, query)
    return await runRequest(this.index.getAll(query))
  }
}
