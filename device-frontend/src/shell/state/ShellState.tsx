import { IsDeviceUnlockedQuery } from "@src/shell/queries/IsDeviceUnlockedQuery.ts"
import { useQuery } from "@tanstack/react-query"
import React from "react"

export type AppContextValue = {
  isUnlocked: boolean
  isServerReachable: boolean
}

const DefaultAppContextValue: AppContextValue = {
  isUnlocked: false,
  isServerReachable: false,
}

export const AppContext = React.createContext<AppContextValue>(DefaultAppContextValue)

export const AppContextProvider = (props: { children: any }) => {
  const isDeviceUnlockedQuery = useQuery({
    ...IsDeviceUnlockedQuery,
    refetchInterval: 2_000,
  })

  const isServerReachable = !isDeviceUnlockedQuery.error

  const contextValue = {
    isServerReachable,
    // Locked while the server can't be reached, as it can't confirm the device is unlocked.
    isUnlocked: isServerReachable && (isDeviceUnlockedQuery.data ?? false),
  }

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  )
}
