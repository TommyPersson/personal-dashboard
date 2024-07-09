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
  Badge,
  Button,
  Chip, IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import { BitbucketPullRequestsEntity } from "@src/apps/bitbucket/entities/BitbucketPullRequestsEntity.ts"
import { BitbucketPullRequest } from "@src/apps/bitbucket/models/BitbucketPullRequest.ts"
import { AppBarIconPortal } from "@src/common/components/AppBarIconPortal/AppBarIconPortal.tsx"
import { AppWidget, AppWidgetHeader } from "@src/common/components/AppWidget/AppWidget.tsx"
import { useEntity } from "@src/infrastructure/framework/entities"
import { useInterval } from "@src/infrastructure/hooks/useInterval.ts"
import { EmptyArray } from "@src/infrastructure/utils"
import React, { useCallback } from "react"

import classes from "./BitbucketAppUI.module.scss"

export const BitbucketAppUI = () => {
  const state = useBitbucketAppState()

  return (
    <>
      <BitbucketAppWidget state={state} />
      <BitbucketAppBarIcon state={state} />
    </>
  )
}

const BitbucketAppWidget = (props: { state: BitbucketAppState }) => {
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
          icon={<AccountTreeOutlined />}
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
}

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
      <ListSubheader>
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
    <Stack direction={"row"} gap={1} alignItems={"center"}>
      <Chip
        size={"small"}
        label={pullRequest.author.name}
        icon={<PersonOutlined />}
      />
      <Chip
        size={"small"}
        label={<>{pullRequest.toRepository} / <strong>{pullRequest.toBranch}</strong></>}
        icon={<ArrowForwardOutlined />}
      />
    </Stack>
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

const BitbucketAppBarIcon = (props: {
  state: BitbucketAppState
}) => {
  const { state } = props

  const numPullRequestsToApprove = state.pullRequests
    .filter(it => it.state === "OPEN" && !it.belongsToUser && !it.userHasApproved)
    .length

  const handleClick = useCallback(() => {
    document.getElementById("bitbucketAppWidget")?.scrollIntoView({ behavior: "smooth" })
  }, [])

  return (
    <AppBarIconPortal appIconId={"bitbucket"} order={900}>
      <IconButton size={"large"} onClick={handleClick}>
        <Badge badgeContent={numPullRequestsToApprove} color={"secondary"}>
          <AccountTreeOutlined />
        </Badge>
      </IconButton>
    </AppBarIconPortal>
  )
}

type BitbucketAppState = {
  pullRequests: BitbucketPullRequest[]
  refresh: () => void
}

function useBitbucketAppState(): BitbucketAppState {
  const entity = useEntity(BitbucketPullRequestsEntity, {
    fetchOnMount: true,
    clearOnFetch: false,
  })

  useInterval(entity.fetchAsync, 60_000)

  const pullRequests: BitbucketPullRequest[] = entity.value ?? EmptyArray

  return {
    pullRequests,
    refresh: entity.fetchAsync,
  }
}