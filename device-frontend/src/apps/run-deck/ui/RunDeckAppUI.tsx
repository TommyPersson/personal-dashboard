import { useRunDeckAppState } from "@src/apps/run-deck/state/RunDeckAppState.ts"
import { RunDeckAppBarIcon } from "@src/apps/run-deck/ui/RunDeckAppBarIcon.tsx"
import { RunDeckAppWidget } from "@src/apps/run-deck/ui/RunDeckAppWidget.tsx"
import React from "react"

export const RunDeckAppUI = () => {
  const state = useRunDeckAppState()

  return (
    <>
      <RunDeckAppWidget state={state} />
      <RunDeckAppBarIcon state={state} />
    </>
  )
}