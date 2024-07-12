import { AccountTreeOutlined } from "@mui/icons-material"
import { GitPullRequestIcon } from "@primer/octicons-react"
import { BitbucketAppState } from "@src/apps/bitbucket/state/BitbucketAppState.ts"
import { LockScreenIcon } from "@src/common/components/LockScreenIcon/LockScreenIcon.tsx"
import React from "react"

export const BitbucketLockScreenIcon = (props: {
  state: BitbucketAppState
}) => {
  const { state } = props

  const numPullRequestsToApprove = state.pullRequests
    .filter(it => it.state === "OPEN" && !it.belongsToUser && !it.userHasApproved)
    .length

  return (
    <LockScreenIcon
      id={"bitbucket-lock-screen-icon"}
      order={900}
      icon={<GitPullRequestIcon size={24} />}
      badgeProps={{
        badgeContent: numPullRequestsToApprove,
        color: "warning"
      }}
    />
  )
}

