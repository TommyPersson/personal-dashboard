import { GithubAppUI } from "@src/apps/github/ui/GithubAppUI.tsx"
import { AppWidgetProvider } from "@src/common/AppWidgetProvider.ts"
import React from "react"

export const githubAppWidgetProvider: AppWidgetProvider = {
  id: "github-app",
  title: "Github",
  factory: () => <GithubAppUI />,
}