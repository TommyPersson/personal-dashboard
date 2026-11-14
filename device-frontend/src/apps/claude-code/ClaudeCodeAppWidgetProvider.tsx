import { ClaudeCodeAppUI } from "@src/apps/claude-code/ui/ClaudeCodeAppUI.tsx"
import { AppWidgetProvider } from "@src/common/AppWidgetProvider.ts"
import React from "react"

export const claudeCodeAppWidgetProvider: AppWidgetProvider = {
  id: "claude-code-app",
  title: "Claude Code",
  factory: () => <ClaudeCodeAppUI />,
}
