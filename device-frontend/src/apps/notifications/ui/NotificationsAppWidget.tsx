import {
  ExpandLessOutlined,
  ExpandMoreOutlined,
  NotificationsOffOutlined,
  NotificationsOutlined,
} from "@mui/icons-material"
import { Badge, Box, Card, CardContent, IconButton, Slide, Stack, Typography } from "@mui/material"
import { ClearNotificationsCommand, DismissNotificationCommand } from "@src/apps/notifications/commands/DismissNotificationCommand.ts"
import { Notification } from "@src/apps/notifications/models/Notification.ts"
import { NotificationsAppState, useNotificationsAppState } from "@src/apps/notifications/state/NotificationsAppState.ts"
import { NotificationsToastOverlay } from "@src/apps/notifications/ui/NotificationsToastOverlay.tsx"
import { AppWidget, AppWidgetHeader } from "@src/common/components/AppWidget/AppWidget.tsx"
import { CommandButton } from "@src/common/components/CommandButton/CommandButton.tsx"
import { DateTimeText } from "@src/common/components/DateTimeText/DateTimeText.tsx"
import { EmptyState } from "@src/common/components/EmptyState/EmptyState.tsx"
import classNames from "classnames"
import React, { CSSProperties } from "react"
import { TransitionGroup } from "react-transition-group"

import classes from "./NotificationsAppWidget.module.scss"


export const NotificationsAppWidget = () => {
  const state = useNotificationsAppState()

  const rightContent = (
    <Stack direction={"row"} sx={{ gap: 2 }}>
      <CommandButton
        command={ClearNotificationsCommand}
        args={{ notificationIds: state.notifications.map(it => it.id) }}
        style={{ justifySelf: "right" }}
      />
    </Stack>
  )

  const widgetClassName = classNames(classes.NotificationsAppWidget, { [classes.Minimized]: state.isMinimized })

  const widgetIcon = state.isMinimized ? (
    <Badge color={"secondary"} badgeContent={state.notifications.length}>
      <IconButton onClick={state.toggleMinimized} style={{ alignSelf: "center", margin: -8 }} color={"inherit"}>
        <NotificationsOutlined />
      </IconButton>

    </Badge>
  ) : (
    <NotificationsOutlined onClick={state.toggleMinimized} />
  )

  const minimizedWidget = (
    <>
      <AppWidget className={widgetClassName}>
        <AppWidgetHeader icon={widgetIcon} />
        <Box sx={{ flex: 1 }} />
        <ToggleMinimizedButton state={state} />
      </AppWidget>
      <NotificationsToastOverlay />
    </>
  )

  const expandedWidget = (
    <>
      <AppWidget className={widgetClassName}>
        <Stack spacing={2} sx={{ flex: 1 }}>
          <AppWidgetHeader
            title={"Notifications"}
            icon={widgetIcon}
            rightContent={rightContent}
          />
          <NotificationsList notifications={state.notifications} />
          <Box sx={{ flex: 1 }} />
          <Stack direction={"row"}>
            <ToggleMinimizedButton state={state} />
          </Stack>
        </Stack>
      </AppWidget>
      <NotificationsToastOverlay />
    </>
  )

  if (state.isMinimized) {
    return minimizedWidget
  } else {
    return expandedWidget
  }
}

const ToggleMinimizedButton = (props: { state: NotificationsAppState }) => {
  const { state } = props

  const icon = state.isMinimized ? <ExpandMoreOutlined /> : <ExpandLessOutlined />

  return (
    <IconButton
      className={classes.ToggleMinimizedButton}
      children={icon}
      style={{ transform: "rotate(-90deg)", fontSize: 20 }}
      onClick={state.toggleMinimized}
    />
  )
}

const NotificationsList = (props: {
  notifications: Notification[]
}) => {
  const { notifications } = props

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={<NotificationsOffOutlined />}
        title={"No notifications available"}
        description={"Nothing to handle right now"}
      />
    )
  }

  return (
    <TransitionGroup component={Stack} spacing={2}>
      {notifications.map(it => (
        <Slide direction={"right"} key={it.id}>
          <NotificationCard notification={it} />
        </Slide>
      ))}
    </TransitionGroup>
  )
}

const NotificationCard = React.forwardRef((props: {
  notification: Notification
  style?: CSSProperties
}, ref) => {
  const { notification, style } = props

  return (
    <Card ref={ref as any} style={style}>
      <CardContent style={{ position: "relative" }}>
        <CommandButton
          command={DismissNotificationCommand}
          args={{ notificationId: notification.id }}
          iconOnly
          style={{ position: "absolute", right: 4, top: 4 }}
        />
        <Typography
          children={notification.source}
          variant={"caption"}
        />
        <Typography
          children={notification.title}
          variant={"subtitle2"}
        />
        {notification.description &&
          <Typography
            children={notification.description}
            variant={"caption"}
            style={{ display: "block" }}
          />}
        <Typography
          children={<DateTimeText value={notification.timestamp} />}
          variant={"caption"}
          color={"text.secondary"}
        />
      </CardContent>
    </Card>
  )
})
