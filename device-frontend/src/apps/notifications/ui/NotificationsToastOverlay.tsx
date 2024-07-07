import { Card, CardContent, Slide, Stack, Typography } from "@mui/material"
import {
  NewNotificationMessage,
  NewNotificationMessageData,
  NotificationDismissedMessage,
  NotificationDismissedMessageData,
} from "@src/apps/notifications/messages"
import { Notification } from "@src/apps/notifications/models/Notification.ts"
import { AppAreaOverlayPortal } from "@src/common/components/AppAreaOverlayPortal/AppAreaOverlayPortal.tsx"
import { useMessageListener } from "@src/infrastructure/hooks/useMessageListener.tsx"
import { useCallback, useState } from "react"
import { TransitionGroup } from "react-transition-group"

import classes from "./NotificationsToastOverlay.module.scss"

export const NotificationsToastOverlay = () => {
  const state = useNotificationsToastState()

  return (
    <AppAreaOverlayPortal>
      <Stack className={classes.NotificationsToastOverlay}>
        <TransitionGroup component={Stack} spacing={2}>
          {state.notifications.map(it => (
            <Slide direction={"right"} key={it.id}>
              <Card raised={true} square={true} className={classes.NotificationToastCard}>
                <NotificationToastCardContent
                  notification={it}
                  removeNotification={state.removeNotification}
                />
              </Card>
            </Slide>
          )) ?? []}
        </TransitionGroup>
      </Stack>
    </AppAreaOverlayPortal>
  )
}

const NotificationToastCardContent = (props: {
  notification: Notification
  removeNotification: (notification: Notification) => void
}) => {
  const { notification } = props
  return (
    <div onClick={() => props.removeNotification(notification)}>
      <CardContent>
        <Stack>
          <Typography
            variant={"caption"}
            children={notification.source}
          />
          <Typography
            variant={"subtitle2"}
            children={notification.title}
          />
          <Typography
            variant={"body2"}
            children={notification.description}
          />
          <Typography
            variant={"caption"}
            color={"text.secondary"}
            children={new Date(notification.timestamp).toLocaleString("sv-SE")}
          />
        </Stack>
      </CardContent>
    </div>
  )
}

type NotificationToastsState = {
  notifications: Notification[]
  removeNotification: (notification: Notification) => void
}

function useNotificationsToastState(): NotificationToastsState {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const handleNewNotification = useCallback((message: NewNotificationMessageData) => {
    setNotifications(s => [message.notification, ...s])
  }, [setNotifications])

  const handleNotificationDismissed = useCallback((message: NotificationDismissedMessageData) => {
    setNotifications(s => s.filter(it => it.id !== message.notificationId))
  }, [setNotifications])

  const removeNotification = useCallback((notification: Notification) => {
    setNotifications(s => s.filter(it => it.id !== notification.id))
  }, [setNotifications])

  useMessageListener(NewNotificationMessage, handleNewNotification)
  useMessageListener(NotificationDismissedMessage, handleNotificationDismissed)

  return {
    notifications,
    removeNotification,
  }
}

