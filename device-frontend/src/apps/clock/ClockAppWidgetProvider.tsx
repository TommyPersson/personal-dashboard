import { ClockAppUI } from "@src/apps/clock/ui/ClockAppUI.tsx"
import { AppWidgetProvider } from "@src/common/AppWidgetProvider.ts"
import React from "react"

export const clockAppWidgetProvider: AppWidgetProvider = {
  id: "clock-app",
  title: "Clock",
  factory: () => <ClockAppUI />,
}