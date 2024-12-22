import { RunDeckAppUI } from "@src/apps/run-deck/ui/RunDeckAppUI.tsx"
import { AppWidgetProvider } from "@src/common/AppWidgetProvider.ts"
import React from "react"

export const runDeckAppWidgetProvider: AppWidgetProvider = {
  id: "run-deck-app",
  title: "Run Deck",
  factory: () => <RunDeckAppUI />,
}