import { Card, CardContent, Slide, Stack, Typography } from "@mui/material"
import { Notification } from "@src/apps/notifications/models/Notification.ts"
import { useNotificationsToastState } from "@src/apps/notifications/state/NotificationToastsState.ts"
import { AppAreaOverlayPortal } from "@src/common/components/AppAreaOverlayPortal/AppAreaOverlayPortal.tsx"
import { TransitionGroup } from "react-transition-group"

import classes from "./NotificationsToastOverlay.module.scss"

/** How long a toast is shown before it hides itself. */
const TOAST_DURATION_MS = 8000

export const NotificationsToastOverlay = () => {
  const state = useNotificationsToastState()

  return (
    <AppAreaOverlayPortal appOverlayId={"notification-toasts"}>
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
  const { notification, removeNotification } = props
  return (
    <div onClick={() => removeNotification(notification)}>
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
      {/* The bar's animation is the toast's timer: the toast hides when it has run out. */}
      <div
        className={classes.CountdownBar}
        style={{ animationDuration: `${TOAST_DURATION_MS}ms` }}
        onAnimationEnd={() => removeNotification(notification)}
      />
    </div>
  )
}
