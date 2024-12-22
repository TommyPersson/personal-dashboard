import { BitbucketAppUI } from "@src/apps/bitbucket/ui/BitbucketAppUI.tsx"
import { AppWidgetProvider } from "@src/common/AppWidgetProvider.ts"
import React from "react"

export const bitbucketAppWidgetProvider: AppWidgetProvider = {
  id: "bitbucket-app",
  title: "Bitbucket",
  factory: () => <BitbucketAppUI />,
}