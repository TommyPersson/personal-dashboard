import { usePomodoroTimerAppState } from "@src/apps/pomodoro-timer/state/PomodoroTimerAppState.ts"
import { PomodoroTimerAppWidget } from "@src/apps/pomodoro-timer/ui/PomodoroTimerAppWidget.tsx"
import { PomodoroTimerAppBarIcon } from "@src/apps/pomodoro-timer/ui/PomodoroTimerAppBarIcon.tsx"
import { PomodoroTimerLockScreenWidget } from "@src/apps/pomodoro-timer/ui/PomodoroTimerLockScreenWidget.tsx"
import React from "react"

export const PomodoroTimerAppUI = () => {
  const state = usePomodoroTimerAppState()

  return (
    <>
      <PomodoroTimerAppWidget state={state} />
      <PomodoroTimerAppBarIcon state={state} />
      <PomodoroTimerLockScreenWidget state={state} />
    </>
  )
}