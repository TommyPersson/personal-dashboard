import {
  NewNotificationMessage,
  NewNotificationMessageData, NotificationDismissedMessage,
  NotificationDismissedMessageData,
} from "@src/apps/notifications/messages"
import { Notification } from "@src/apps/notifications/models/Notification.ts"
import { useMessageListener } from "@src/infrastructure/hooks/useMessageListener.tsx"
import { useCallback, useState } from "react"

export type NotificationToastsState = {
  notifications: Notification[]
  removeNotification: (notification: Notification) => void
}

export function useNotificationsToastState(): NotificationToastsState {
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

