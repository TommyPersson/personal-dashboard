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
import { MarkAllNotificationsAsRead } from "@src/apps/github/actions/MarkAllNotificationsAsRead.ts"
import { GithubNotificationsEntity } from "@src/apps/github/entities/GithubNotificationsEntity.ts"
import { GithubNotification } from "@src/apps/github/models/GithubNotification.ts"
import { AppWidget, AppWidgetHeader } from "@src/common/components/AppWidget/AppWidget.tsx"
import { EmptyState } from "@src/common/components/EmptyState/EmptyState.tsx"
import { useEntity } from "@src/infrastructure/framework/entities"
import { useAction } from "@src/infrastructure/framework/entities/useAction.tsx"
import { useInterval } from "@src/infrastructure/hooks/useInterval.ts"
import { EmptyArray } from "@src/infrastructure/utils"
import React, { useCallback } from "react"

import classes from "./GithubAppUI.module.scss"


export const GithubAppUI = () => {
  const entity = useEntity(GithubNotificationsEntity, {
    fetchOnMount: true,
    clearOnFetch: false,
  })

  const markAllAsReadAction = useAction(MarkAllNotificationsAsRead)

  const handleMarkAllAsReadClicked = useCallback(async () => {
    await markAllAsReadAction.execute()
    entity.fetchAsync
  }, [markAllAsReadAction.execute, entity.fetchAsync])

  useInterval(entity.fetchAsync, 5 * 60_000)

  const notifications: GithubNotification[] = entity.value ?? EmptyArray

  return (
    <AppWidget className={classes.GithubAppWidget}>
      <Stack spacing={2}>
        <AppWidgetHeader
          title={"Github Notifications"}
          icon={<MarkGithubIcon /> as any}
          rightContent={(
            <>
              <Button
                startIcon={<RefreshOutlined />}
                onClick={entity.fetchAsync}
                children={"Refresh"}
              />
              <Button
                startIcon={<MarkEmailReadOutlined />}
                onClick={handleMarkAllAsReadClicked}
                children={"Mark all as read"}
              />
            </>
          )}
        />
        {notifications.length > 0 ? (
          <List component={Paper}>
            {notifications.map(it => <NotificationListItem key={it.id} notification={it} />)}
          </List>
        ) : (
          <EmptyState description={"No notifications available"} />
        )}
      </Stack>
    </AppWidget>
  )
}

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