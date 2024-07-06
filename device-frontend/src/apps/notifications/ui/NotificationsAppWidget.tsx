import {
  Close,
  ExpandLessOutlined, ExpandMore, ExpandMoreOutlined,
  NotificationsOffOutlined,
  NotificationsOutlined,
  TimerOutlined,
} from "@mui/icons-material"
import { Badge, Box, Button, Card, CardContent, IconButton, Slide, Stack, Typography } from "@mui/material"
import { AppWidget, AppWidgetHeader } from "@src/common/components/AppWidget/AppWidget.tsx"
import { EmptyState } from "@src/common/components/EmptyState/EmptyState.tsx"
import { useEntity } from "@src/infrastructure/framework/entities"
import classNames from "classnames"
import React, { CSSProperties, useCallback, useEffect, useState } from "react"
import { TransitionGroup } from "react-transition-group"

import classes from "./NotificationsAppWidget.module.scss"


export const NotificationsAppWidget = () => {
  const state = useNotificationsState()

  const rightContent = (
    <Stack direction={"row"} gap={2}>
      <Button
        onClick={state.clear}
        children={"Clear"}
        startIcon={<Close />}
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
    <AppWidget className={widgetClassName}>
      <AppWidgetHeader icon={widgetIcon} />
      <Box flex={1} />
      <ToggleMinimizedButton state={state} />
    </AppWidget>
  )

  const expandedWidget = <>
    <AppWidget className={widgetClassName}>
      <Stack spacing={2} flex={1}>
        <AppWidgetHeader
          title={"Notifications"}
          icon={widgetIcon}
          rightContent={rightContent}
        />
        <NotificationsList notifications={state.notifications} />
        <Box flex={1} />
        <Stack direction={"row"}>
          <ToggleMinimizedButton state={state} />
        </Stack>
      </Stack>
    </AppWidget>
  </>

  if (state.isMinimized) {
    return minimizedWidget
  } else {
    return expandedWidget
  }
}

const ToggleMinimizedButton = (props: { state: NotificationsState }) => {
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

const NotificationsList = (props: { notifications: Notification[] }) => {
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

const NotificationCard = React.forwardRef((props: { notification: Notification, style?: CSSProperties }, ref) => {
  const { notification, style } = props

  return (
    <Card ref={ref as any} style={style}>
      <CardContent style={{ position: "relative" }}>
        <IconButton style={{ position: "absolute", right: 4, top: 4 }}><Close /></IconButton>
        <Typography
          children={notification.source}
          variant={"caption"}
        />
        <Typography
          children={notification.title}
          variant={"subtitle2"}
        />
        {notification.body &&
          <Typography
            children={notification.body}
            variant={"caption"}
            style={{ display: "block" }}
          />}
        <Typography
          children={notification.timestamp.toLocaleString("sv-SE")}
          variant={"caption"}
          color={"text.secondary"}
        />
      </CardContent>
    </Card>
  )
})

const exampleData: Notification[] = [
  {
    id: "25251f45-d10a-4588-a7f0-5bba74066ea5",
    title: "New Pull Request Available",
    body: "ASDF-1234: Fix things in the fnord",
    timestamp: new Date(),
    source: "Bitbucket",
  },
  {
    id: "51e31b3a-3c54-47c4-8436-e08599718d62",
    title: "Build failed: WQER-4321 #1",
    timestamp: new Date(),
    source: "Jenkins",
  },
  {
    id: "2b92575b-ca07-4e95-a5e7-912a6df72bde",
    title: "RWK job failed: the-best-service/the-queue-id",
    timestamp: new Date(),
    source: "the-best-service",
  },
]

export type Notification = {
  id: string
  title: string
  body?: string
  timestamp: Date
  source: string
}

export type NotificationsState = {
  notifications: Notification[]
  isMinimized: boolean
  toggleMinimized: () => void
  add: () => void
  remove: () => void
  clear: () => void
}

function useNotificationsState(): NotificationsState {
  const [count, setCount] = useState(1)

  const [isMinimized, setIsMinimized] = useState(false)

  const items = exampleData.slice(0, Math.min(count, exampleData.length))

  const add = useCallback(() => {
    setCount(s => Math.min(exampleData.length, s + 1))
  }, [setCount])

  const remove = useCallback(() => {
    setCount(s => Math.max(0, s - 1))
  }, [setCount])

  const clear = useCallback(() => {
    setCount(0)
  }, [setCount])

  const toggleMinimized = useCallback(() => {
    setIsMinimized(s => !s)
  }, [setIsMinimized])

  useEffect(() => {
    if (count <= 0) {
      setIsMinimized(true)
    }
  }, [count, setIsMinimized])

  return {
    notifications: items,
    isMinimized: isMinimized,
    toggleMinimized,
    add,
    remove,
    clear,
  }
}