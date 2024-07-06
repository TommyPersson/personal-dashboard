import { DefaultObjectStore, ObjectStore } from "@src/infrastructure/framework/entities/ObjectStore.tsx"
import { createContext } from "react"


export type EntityStateContextValue = {
  get<T extends object>(key: string): T | null
  set<T extends object>(key: string, valueFn: (value: T | null) => T): void
  set<T extends object>(key: string, value: T): void
  remove(key: string): void
  subscribe(listener: (key: string, value: any | null) => void): void
  unsubscribe(listener: (key: string, value: any | null) => void): void
}

export const EntityStateContext = createContext<EntityStateContextValue>(new DefaultObjectStore())

export const EntityStateContextProvider = (props: { children: any, store: ObjectStore }) => {
  const { children, store } = props

  return (
    <EntityStateContext.Provider value={store}>
      {children}
    </EntityStateContext.Provider>
  )
}
