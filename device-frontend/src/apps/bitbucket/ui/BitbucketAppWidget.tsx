import {
  AccountTreeOutlined,
  ArrowForwardOutlined,
  CancelOutlined,
  CheckBoxOutlineBlank,
  CheckBoxOutlined,
  CheckCircleOutlined,
  CircleOutlined,
  CommentOutlined,
  PersonOutlined,
  RefreshOutlined,
  ThumbDownOutlined,
  ThumbUpOutlined,
} from "@mui/icons-material"
import {
  Button,
  Chip,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import { GitPullRequestIcon } from "@primer/octicons-react"
import { BitbucketPullRequest } from "@src/apps/bitbucket/models/BitbucketPullRequest.ts"
import { BitbucketAppState } from "@src/apps/bitbucket/state/BitbucketAppState.ts"

import classes from "@src/apps/bitbucket/ui/BitbucketAppWidget.module.scss"
import { AppWidget, AppWidgetHeader } from "@src/common/components/AppWidget/AppWidget.tsx"
import React from "react"

export const BitbucketAppWidget = React.memo((props: { state: BitbucketAppState }) => {
  const { state } = props

  const openPullRequests = state.pullRequests.filter(it => it.state === "OPEN" && !it.belongsToUser)
  const usersPullRequests = state.pullRequests.filter(it => it.state === "OPEN" && it.belongsToUser)
  const declinedPullRequests = state.pullRequests.filter(it => it.state === "DECLINED")
  const mergedPullRequests = state.pullRequests.filter(it => it.state === "MERGED")

  return (
    <AppWidget className={classes.BitbucketAppWidget} id={"bitbucketAppWidget"}>
      <Stack spacing={2}>
        <AppWidgetHeader
          title={"Bitbucket Pull Requests"}
          icon={<GitPullRequestIcon />}
          rightContent={<Button startIcon={<RefreshOutlined />} children={"Refresh"} onClick={state.refresh} />}
        />
        <PullRequestListCard title={"Open"} pullRequests={openPullRequests} />
        <PullRequestListCard title={"Your pull requests"} pullRequests={usersPullRequests} />
        <Typography variant={"caption"} children={"Recently closed"} alignSelf={"center"} />
        <PullRequestListCard title={"Declined"} pullRequests={declinedPullRequests} />
        <PullRequestListCard title={"Merged"} pullRequests={mergedPullRequests} />
      </Stack>
    </AppWidget>
  )
})

const PullRequestListCard = (props: {
  title: string
  pullRequests: BitbucketPullRequest[]
}) => {
  const { title, pullRequests } = props

  const hasRows = pullRequests.length > 0

  const content = hasRows ? (
    pullRequests.map(it =>
      <PullRequestItemRow key={it.id} pullRequest={it} />,
    )
  ) : (
    <Stack alignItems={"center"}>
      <Typography variant={"body2"} children={"None"} fontStyle={"italic"} />
    </Stack>
  )

  return (
    <List className={classes.PullRequestListCard} component={Paper}>
      <ListSubheader disableSticky>
        {title}
      </ListSubheader>
      {content}
    </List>
  )
}


const PullRequestItemRow = (props: { pullRequest: BitbucketPullRequest }) => {
  const { pullRequest } = props

  const hasComments = pullRequest.numComments > 0
  const hasOpenTasks = pullRequest.numOpenTasks > 0
  const hasResolvedTasks = pullRequest.numResolvedTasks > 0

  const numApprovals = pullRequest.reviewers.filter(it => it.status === "APPROVED").length
  const numReviewers = pullRequest.reviewers.length
  const numNeedsWork = pullRequest.reviewers.filter(it => it.status === "NEEDS_WORK").length

  return (
    <ListItemButton className={classes.PullRequestListItem} divider={true}>
      <ListItemIcon>
        <PullRequestStatusIcon pullRequest={pullRequest} />
      </ListItemIcon>
      <ListItemText
        primary={pullRequest.title}
        secondary={<MergeDescription pullRequest={pullRequest} />}
      />
      <Stack className={classes.ItemStatusIcons}>
        {hasComments && <IconWithText
          icon={<CommentOutlined fontSize={"small"} />}
          text={pullRequest.numComments}
        />}
        {hasOpenTasks && <IconWithText
          icon={<CheckBoxOutlineBlank fontSize={"small"} />}
          text={pullRequest.numOpenTasks}
        />}
        {hasResolvedTasks && <IconWithText
          icon={<CheckBoxOutlined fontSize={"small"} />}
          text={pullRequest.numResolvedTasks}
        />}
        <IconWithText
          icon={<ThumbUpOutlined fontSize={"small"} />}
          text={`${numApprovals} / ${numReviewers}`}
        />
        <IconWithText
          icon={<ThumbDownOutlined fontSize={"small"} />}
          text={numNeedsWork}
        />
      </Stack>
    </ListItemButton>
  )
}

const MergeDescription = (props: { pullRequest: BitbucketPullRequest }) => {
  const { pullRequest } = props

  return (
    <>
      <Chip
        component={"span"}
        size={"small"}
        label={pullRequest.author.name}
        icon={<PersonOutlined />}
      />
      &nbsp;&nbsp;
      <Chip
        component={"span"}
        size={"small"}
        label={<>{pullRequest.toRepository} / <strong>{pullRequest.toBranch}</strong></>}
        icon={<ArrowForwardOutlined />}
      />
    </>
  )
}

const PullRequestStatusIcon = (props: { pullRequest: BitbucketPullRequest }) => {
  const { pullRequest } = props

  if (pullRequest.userHasApproved || pullRequest.state === "MERGED") {
    return <CheckCircleOutlined color={"success"} />
  }

  if (pullRequest.state === "OPEN" && !pullRequest.belongsToUser) {
    return <CircleOutlined color={"warning"} />
  }

  if (pullRequest.state === "DECLINED") {
    return <CancelOutlined color={"error"} />
  }

  return <CircleOutlined />
}

const IconWithText = (props: {
  icon: any,
  text: any,
}) => {
  return (
    <Stack direction={"row"} gap={1} alignItems={"center"}>
      {props.icon}
      <Typography variant={"subtitle2"} children={props.text} />
    </Stack>
  )
}
