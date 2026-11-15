import {
  NewNotificationMessage,
  NewNotificationMessageData, NotificationDismissedMessage,
  NotificationDismissedMessageData,
} from "@src/apps/notifications/messages"
import { Notification, NotificationSchema } from "@src/apps/notifications/models/Notification.ts"
import { useMessageListener } from "@src/infrastructure/hooks/useMessageListener.tsx"
import { useDeepEqualMemo } from "@src/infrastructure/utils/hooks.ts"
import { useCallback, useState } from "react"

export type NotificationToastsState = {
  notifications: Notification[]
  removeNotification: (notification: Notification) => void
}

export function useNotificationsToastState(): NotificationToastsState {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const handleNewNotification = useCallback((message: NewNotificationMessageData) => {
    const notification = NotificationSchema.parse(message.notification)
    setNotifications(s => [notification, ...s])
  }, [setNotifications])

  const handleNotificationDismissed = useCallback((message: NotificationDismissedMessageData) => {
    setNotifications(s => s.filter(it => it.id !== message.notificationId))
  }, [setNotifications])

  const removeNotification = useCallback((notification: Notification) => {
    setNotifications(s => s.filter(it => it.id !== notification.id))
  }, [setNotifications])

  useMessageListener(NewNotificationMessage, handleNewNotification)
  useMessageListener(NotificationDismissedMessage, handleNotificationDismissed)

  return useDeepEqualMemo(() => ({
    notifications,
    removeNotification,
  }), [notifications, removeNotification])
}

