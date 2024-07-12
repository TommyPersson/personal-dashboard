import React, { useCallback, useState } from "react"

export type AppContextValue = {
  isLocked: boolean
  lock: () => void
  unlock: () => void
}

const DefaultAppContextValue: AppContextValue = {
  isLocked: true,
  lock: () => {},
  unlock: () => {}
}

export const AppContext = React.createContext<AppContextValue>(DefaultAppContextValue)

export const AppContextProvider = (props: { children: any }) => {
  const [isLocked, setIsLocked] = useState(true)

  const lock = useCallback(() => {
    setIsLocked(true)
  }, [setIsLocked])

  const unlock = useCallback(() => {
    setIsLocked(false)
  }, [setIsLocked])

  const contextValue = { isLocked, lock, unlock }

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  )
}