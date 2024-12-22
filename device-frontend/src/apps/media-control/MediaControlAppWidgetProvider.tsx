import { MediaControlUI } from "@src/apps/media-control/ui/MediaControlUI.tsx"
import { AppWidgetProvider } from "@src/common/AppWidgetProvider.ts"
import React from "react"

export const mediaControlAppWidgetProvider: AppWidgetProvider = {
  id: "media-control-app",
  title: "Media Control",
  factory: () => <MediaControlUI />,
}