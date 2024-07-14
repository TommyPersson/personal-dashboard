import { MarkEmailReadOutlined, RefreshOutlined } from "@mui/icons-material"
import { Button, Chip, List, ListItemButton, ListItemIcon, ListItemText, Paper, Stack, Typography } from "@mui/material"
import {
  CommentDiscussionIcon,
  GitPullRequestIcon,
  MarkGithubIcon,
  QuestionIcon,
  RepoIcon,
  TagIcon,
} from "@primer/octicons-react"
import { GithubNotification } from "@src/apps/github/models/GithubNotification.ts"
import { GithubAppState } from "@src/apps/github/state/GithubAppState.ts"
import { AppWidget, AppWidgetHeader } from "@src/common/components/AppWidget/AppWidget.tsx"
import { EmptyState } from "@src/common/components/EmptyState/EmptyState.tsx"
import React from "react"

import classes from "./GithubAppWidget.module.scss"


export const GithubAppWidget = React.memo((props: { state: GithubAppState }) => {
  const { state } = props

  return (
    <AppWidget
      className={classes.GithubAppWidget} id={"githubAppWidget"}>
      <Stack spacing={2}>
        <AppWidgetHeader
          title={"Github Notifications"}
          icon={<MarkGithubIcon /> as any}
          rightContent={(
            <>
              <Button
                startIcon={<RefreshOutlined />}
                onClick={state.refresh}
                children={"Refresh"}
              />
              <Button
                startIcon={<MarkEmailReadOutlined />}
                onClick={state.markAllAsRead}
                children={"Mark all as read"}
              />
            </>
          )}
        />
        {state.notifications.length > 0 ? (
          <List component={Paper}>
            {state.notifications.map(it => <NotificationListItem key={it.id} notification={it} />)}
          </List>
        ) : (
          <EmptyState description={"No notifications available"} />
        )}
      </Stack>
    </AppWidget>
  )
})

const NotificationListItem = (props: { notification: GithubNotification }) => {
  const { notification } = props

  const date = new Date(notification.updatedAt)

  return (
    <ListItemButton divider={true}>
      <ListItemIcon>{getTypeIcon(notification)}</ListItemIcon>
      <ListItemText
        primary={(
          <>
            <Typography variant={"caption"}>{date.toLocaleString("sv-SE")}</Typography><br />
            {notification.title}
          </>
        )}
        secondary={(
          <Chip
            size={"small"}
            label={notification.repositoryFullName}
            icon={<RepoIcon />}
          />
        )}
      />
    </ListItemButton>
  )
}

function getTypeIcon(notification: GithubNotification): any {
  switch (notification.type) {
    case "PullRequest":
      return <GitPullRequestIcon />
    case "Discussion":
      return <CommentDiscussionIcon />
    case "Release":
      return <TagIcon />
    default:
      return <QuestionIcon />
  }
}
