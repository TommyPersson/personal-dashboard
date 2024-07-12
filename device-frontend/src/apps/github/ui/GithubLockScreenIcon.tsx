import { MarkGithubIcon } from "@primer/octicons-react"
import { GithubAppState } from "@src/apps/github/state/GithubAppState.ts"
import { AppBarIcon } from "@src/common/components/AppBarIcon/AppBarIcon.tsx"
import { LockScreenIcon } from "@src/common/components/LockScreenIcon/LockScreenIcon.tsx"
import { useScrollIntoView } from "@src/infrastructure/utils/hooks.ts"
import React from "react"

export const GithubLockScreenIcon = (props: {
  state: GithubAppState
}) => {
  const { state } = props

  if (state.notifications.length <= 0) {
    return null
  }

  return (
    <LockScreenIcon
      id={"github"}
      order={950}
      icon={<MarkGithubIcon size={24} />}
      badgeProps={{
        badgeContent: state.notifications.length,
        color: "secondary",
      }}
    />
  )
}