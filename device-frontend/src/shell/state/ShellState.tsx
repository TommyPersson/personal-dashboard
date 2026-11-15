import { LockDeviceMutation } from "@src/shell/mutations/LockDeviceMutation.ts"
import { UnlockDeviceMutation } from "@src/shell/mutations/UnlockDeviceMutation.ts"
import { IsDeviceUnlockedQuery } from "@src/shell/queries/IsDeviceUnlockedQuery.ts"
import { useMutation, useQuery } from "@tanstack/react-query"
import React, { useCallback } from "react"

export type AppContextValue = {
  isUnlocked: boolean
  isServerReachable: boolean
  lock: () => void
  unlock: (pinCode: string) => void
  unlockInProgress: boolean
  unlockError: Error | null
}

const DefaultAppContextValue: AppContextValue = {
  isUnlocked: false,
  isServerReachable: false,
  lock: () => {},
  unlock: () => {},
  unlockInProgress: false,
  unlockError: null,
}

export const AppContext = React.createContext<AppContextValue>(DefaultAppContextValue)

export const AppContextProvider = (props: { children: any }) => {
  const isDeviceUnlockedQuery = useQuery({
    ...IsDeviceUnlockedQuery,
    refetchInterval: 2_000,
  })

  const { mutate: unlockMutate, isPending: unlockInProgress, error: unlockError } = useMutation(UnlockDeviceMutation)
  const { mutate: lockMutate } = useMutation(LockDeviceMutation)

  const lock = useCallback(() => lockMutate(), [lockMutate])
  const unlock = useCallback((pinCode: string) => unlockMutate({ pinCode }), [unlockMutate])

  const isServerReachable = !isDeviceUnlockedQuery.error

  const contextValue = {
    isServerReachable,
    // Locked while the server can't be reached, as it can't confirm the device is unlocked.
    isUnlocked: isServerReachable && (isDeviceUnlockedQuery.data ?? false),
    lock,
    unlock,
    unlockInProgress,
    unlockError,
  }

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  )
}
