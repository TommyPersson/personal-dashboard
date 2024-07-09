import { AccountTreeOutlined } from "@mui/icons-material"
import { Badge, IconButton } from "@mui/material"
import { BitbucketAppState } from "@src/apps/bitbucket/state/BitbucketAppState.ts"
import { AppBarIconPortal } from "@src/common/components/AppBarIconPortal/AppBarIconPortal.tsx"
import { useScrollIntoView } from "@src/infrastructure/utils/hooks.ts"
import React from "react"

export const BitbucketAppBarIcon = (props: {
  state: BitbucketAppState
}) => {
  const { state } = props

  const numPullRequestsToApprove = state.pullRequests
    .filter(it => it.state === "OPEN" && !it.belongsToUser && !it.userHasApproved)
    .length

  const handleClick = useScrollIntoView("bitbucketAppWidget")

  return (
    <AppBarIconPortal appIconId={"bitbucket"} order={900}>
      <IconButton size={"large"} onClick={handleClick}>
        <Badge badgeContent={numPullRequestsToApprove} color={"warning"}>
          <AccountTreeOutlined />
        </Badge>
      </IconButton>
    </AppBarIconPortal>
  )
}