export interface DbModel {}

export async function runRequest<T = any>(request: IDBRequest<T>): Promise<T> {
  return new Promise<any>(function (resolve, reject) {
    request.onsuccess = (): void => {
      console.debug("storage/utils", "runRequest", "success", request.source, request.result)
      resolve(request.result)
    }
    request.onerror = (): void => {
      console.error("storage/utils", "runRequest", "failure", request.source, request.error)
      debugger
      reject()
    }
  })
}

export class DbAccess<M extends DbModel> {
  private readonly store: IDBObjectStore

  constructor(store: IDBObjectStore) {
    this.store = store
  }

  async put(model: M): Promise<void> {
    console.debug("DbAccess", "put", this.store.name, model)
    await runRequest(this.store.put(model))
  }

  async add(model: M): Promise<any> {
    console.debug("DbAccess", "add", this.store.name, model)
    return await runRequest(this.store.add(model))
  }

  index(name: string): DbIndex<M> {
    return new DbIndex<M>(this.store.index(name))
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

  async getAll(query: IDBValidKey[] | null): Promise<M[]> {
    console.debug("DbIndex", "getAll", this.index.name, query)
    return await runRequest(this.index.getAll(query))
  }

  async deleteAll(query: IDBValidKey[] | null): Promise<void> {
    console.debug("DbIndex", "deleteAll", this.index.name, query)
    const cursor: IDBCursorWithValue | null = await runRequest(this.index.openCursor(query))
    while (cursor !== null) {
      console.debug("DbIndex", "deleteAll", this.index.name, query, cursor.value)
      cursor.delete()
      cursor.continue()
    }
  }
}
