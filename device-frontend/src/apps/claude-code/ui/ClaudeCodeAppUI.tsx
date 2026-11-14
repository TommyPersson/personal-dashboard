import { useClaudeCodeAppState } from "@src/apps/claude-code/state/ClaudeCodeAppState.ts"
import { ClaudeCodeAppBarIcon } from "@src/apps/claude-code/ui/ClaudeCodeAppBarIcon.tsx"
import { ClaudeCodeAppWidget } from "@src/apps/claude-code/ui/ClaudeCodeAppWidget.tsx"
import { ClaudeCodeLockScreenIcon } from "@src/apps/claude-code/ui/ClaudeCodeLockScreenIcon.tsx"
import React from "react"

export const ClaudeCodeAppUI = () => {
  const state = useClaudeCodeAppState()

  return (
    <>
      <ClaudeCodeAppWidget state={state} />
      <ClaudeCodeAppBarIcon state={state} />
      <ClaudeCodeLockScreenIcon state={state} />
    </>
  )
}
