import { MarkGithubIcon } from "@primer/octicons-react"
import { GithubAppState } from "@src/apps/github/state/GithubAppState.ts"
import { LockScreenIcon } from "@src/common/components/LockScreenIcon/LockScreenIcon.tsx"
import React from "react"

export const GithubLockScreenIcon = React.memo((props: {
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
})