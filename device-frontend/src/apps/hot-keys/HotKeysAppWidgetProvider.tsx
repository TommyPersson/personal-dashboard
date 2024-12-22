import { HotKeysAppUI } from "@src/apps/hot-keys/ui/HotKeysAppUI.tsx"
import { AppWidgetProvider } from "@src/common/AppWidgetProvider.ts"
import React from "react"

export const hotKeysAppWidgetProvider: AppWidgetProvider = {
  id: "hot-keys-app",
  title: "Hot Keys",
  factory: () => <HotKeysAppUI />,
}