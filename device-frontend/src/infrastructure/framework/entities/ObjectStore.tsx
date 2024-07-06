export interface ObjectStore {
  get<T extends object>(key: string): T | null

  set<T extends object>(key: string, valueFn: (value: T | null) => T): void

  set<T extends object>(key: string, value: T): void

  remove(key: string): void

  subscribe(listener: (key: string, value: any | null) => void): void

  unsubscribe(listener: (key: string, value: any | null) => void): void
}

export class DefaultObjectStore implements ObjectStore {

  private readonly store: Map<string, any> = new Map()
  private readonly listeners: Set<(key: string, value: any | null) => void> = new Set()

  constructor() {
    this.get = this.get.bind(this)
    this.remove = this.remove.bind(this)
    this.set = this.set.bind(this)
    this.subscribe = this.subscribe.bind(this)
    this.unsubscribe = this.unsubscribe.bind(this)
  }

  get<T extends object>(key: string): T | null {
    return this.store.get(key) ?? null
  }

  remove(key: string): void {
    this.store.delete(key)

    for (const listener of this.listeners) {
      listener(key, null)
    }
  }

  set<T extends object>(key: string, value: T): void
  set<T extends object>(key: string, valueFn: (value: T | null) => T): void
  set<T extends object>(key: string, valueOrFn: T | ((value: T | null) => T)): void {
    let value
    if (typeof valueOrFn === "function") {
      value = valueOrFn(this.get(key))
    } else {
      value = valueOrFn
    }

    this.store.set(key, value)

    for (const listener of this.listeners) {
      listener(key, value)
    }
  }

  subscribe(listener: (key: string, value: any | null) => void) {
    this.listeners.add(listener)
  }

  unsubscribe(listener: (key: string, value: any | null) => void) {
    this.listeners.delete(listener)
  }
}
