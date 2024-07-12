import { useClockAppState } from "@src/apps/clock/state/ClockAppState.ts"
import { ClockLockScreenWidget } from "@src/apps/clock/ui/ClockLockScreenWidget.tsx"
import React from "react"

export const ClockAppUI = () => {
  const state = useClockAppState()

  return (
    <>
      <ClockLockScreenWidget state={state} />
    </>
  )
}