import { useGithubState } from "@src/apps/github/state/GithubAppState.ts"
import { GithubAppBarIcon } from "@src/apps/github/ui/GithubAppBarIcon.tsx"
import { GithubAppWidget } from "@src/apps/github/ui/GithubAppWidget.tsx"
import { GithubLockScreenIcon } from "@src/apps/github/ui/GithubLockScreenIcon.tsx"
import React from "react"


export const GithubAppUI = () => {
  const state = useGithubState()

  return (
    <>
      <GithubAppWidget state={state} />
      <GithubAppBarIcon state={state} />
      <GithubLockScreenIcon state={state} />
    </>
  )
}


