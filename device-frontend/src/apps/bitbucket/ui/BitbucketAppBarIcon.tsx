import { GitPullRequestIcon } from "@primer/octicons-react"
import { BitbucketAppState } from "@src/apps/bitbucket/state/BitbucketAppState.ts"
import { AppBarIcon } from "@src/common/components/AppBarIcon/AppBarIcon.tsx"
import { useScrollIntoView } from "@src/infrastructure/utils/hooks.ts"
import React from "react"

export const BitbucketAppBarIcon = React.memo((props: {
  state: BitbucketAppState
}) => {
  const { state } = props

  const numPullRequestsToApprove = state.pullRequests
    .filter(it => it.state === "OPEN" && !it.belongsToUser && !it.userHasApproved)
    .length

  const handleClick = useScrollIntoView("bitbucketAppWidget")

  return (
    <AppBarIcon
      id={"bitbucket"}
      order={900}
      icon={<GitPullRequestIcon size={24} />}
      badgeProps={{
        badgeContent: numPullRequestsToApprove,
        color: "warning"
      }}
      onClick={handleClick}
    />
  )
})

