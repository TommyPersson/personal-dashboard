import { PomodoroTimerAppUI } from "@src/apps/pomodoro-timer/ui/PomodoroTimerAppUI.tsx"
import { AppWidgetProvider } from "@src/common/AppWidgetProvider.ts"
import React from "react"

export const pomodoroAppWidgetProvider: AppWidgetProvider = {
  id: "pomodoro-app",
  title: "Pomodoro Timer",
  factory: () => <PomodoroTimerAppUI />,
}