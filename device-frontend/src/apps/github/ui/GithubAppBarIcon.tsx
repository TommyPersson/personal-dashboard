import { MarkGithubIcon } from "@primer/octicons-react"
import { GithubAppState } from "@src/apps/github/state/GithubAppState.ts"
import { AppBarIcon } from "@src/common/components/AppBarIcon/AppBarIcon.tsx"
import { useScrollIntoView } from "@src/infrastructure/utils/hooks.ts"
import React from "react"

export const GithubAppBarIcon = (props: {
  state: GithubAppState
}) => {
  const { state } = props

  const handleClick = useScrollIntoView("githubAppWidget")

  return (
    <AppBarIcon
      id={"github"}
      order={950}
      icon={<MarkGithubIcon size={24} />}
      badgeProps={{
        badgeContent: state.notifications.length,
        color: "secondary",
      }}
      onClick={handleClick}
    />
  )
}