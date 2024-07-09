import { Badge, IconButton } from "@mui/material"
import { MarkGithubIcon } from "@primer/octicons-react"
import { GithubAppState } from "@src/apps/github/state/GithubAppState.ts"
import { AppBarIconPortal } from "@src/common/components/AppBarIconPortal/AppBarIconPortal.tsx"
import { useScrollIntoView } from "@src/infrastructure/utils/hooks.ts"
import React from "react"

export const GithubAppBarIcon = (props: {
  state: GithubAppState
}) => {
  const { state } = props

  const handleClick = useScrollIntoView("githubAppWidget")

  return (
    <AppBarIconPortal appIconId={"github"} order={950}>
      <IconButton size={"large"} onClick={handleClick}>
        <Badge badgeContent={state.notifications.length} color={"secondary"}>
          <MarkGithubIcon size={24} />
        </Badge>
      </IconButton>
    </AppBarIconPortal>
  )
}