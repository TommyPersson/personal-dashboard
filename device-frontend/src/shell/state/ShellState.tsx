import { useEntity } from "@src/infrastructure/framework/entities"
import { useAction } from "@src/infrastructure/framework/entities/useAction.tsx"
import { useInterval } from "@src/infrastructure/hooks/useInterval.ts"
import { LockDeviceAction } from "@src/shell/actions"
import { UnlockDeviceAction } from "@src/shell/actions/UnlockDeviceAction.ts"
import { IsDeviceUnlockedEntity } from "@src/shell/entities"
import React, { useCallback, useEffect, useState } from "react"

export type AppContextValue = {
  isUnlocked: boolean
  lock: () => void
  unlock: (pinCode: string) => void
  unlockInProgress: boolean
  unlockError: Error | null
}

const DefaultAppContextValue: AppContextValue = {
  isUnlocked: true,
  lock: () => {},
  unlock: (pinCode: string) => {},
  unlockInProgress: false,
  unlockError: null,
}

export const AppContext = React.createContext<AppContextValue>(DefaultAppContextValue)

export const AppContextProvider = (props: { children: any }) => {
  const { fetch: refreshIsDeviceUnlocked, ...isDeviceUnlockedEntity }  = useEntity(IsDeviceUnlockedEntity, {
    fetchOnMount: true,
    clearOnFetch: false,
  })

  const { execute: executeUnlock, ...unlockDeviceAction } = useAction(UnlockDeviceAction)
  const { execute: executeLock, ...lockDeviceAction } = useAction(LockDeviceAction)

  const lock = useCallback(async () => {
    isDeviceUnlockedEntity.clear()
    await executeLock()
    await refreshIsDeviceUnlocked()
  }, [executeLock, refreshIsDeviceUnlocked, isDeviceUnlockedEntity.clear])

  const unlock = useCallback(async (pinCode: string) => {
    await executeUnlock({ pinCode })
    await refreshIsDeviceUnlocked()
  }, [executeUnlock, refreshIsDeviceUnlocked])

  useInterval(refreshIsDeviceUnlocked, 10_000)

  const contextValue = {
    isUnlocked: isDeviceUnlockedEntity.value ?? false,
    lock,
    unlock,
    unlockInProgress: unlockDeviceAction.isInProgress,
    unlockError: unlockDeviceAction.error,
  }

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  )
}