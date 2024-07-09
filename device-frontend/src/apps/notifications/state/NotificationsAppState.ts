import { DismissNotificationAction } from "@src/apps/notifications/actions"
import { NotificationsEntity } from "@src/apps/notifications/entities/NotificationsEntity.ts"
import { NewNotificationMessage, NotificationDismissedMessage } from "@src/apps/notifications/messages"
import { Notification } from "@src/apps/notifications/models/Notification.ts"
import { useEntity } from "@src/infrastructure/framework/entities"
import { useAction } from "@src/infrastructure/framework/entities/useAction.tsx"
import { useInterval } from "@src/infrastructure/hooks/useInterval.ts"
import { useMessageListener } from "@src/infrastructure/hooks/useMessageListener.tsx"
import { EmptyArray } from "@src/infrastructure/utils"
import { useCallback, useEffect, useState } from "react"

export type NotificationsAppState = {
  notifications: Notification[]
  isMinimized: boolean
  toggleMinimized: () => void
  dismiss: (notification: Notification) => void
  clear: () => void
}

export function useNotificationsAppState(): NotificationsAppState {
  const entity = useEntity(NotificationsEntity, {
    fetchOnMount: true,
    clearOnFetch: false,
  })

  const dismissAction = useAction(DismissNotificationAction)

  const [isMinimized, setIsMinimized] = useState(false)

  const items = entity.value ?? EmptyArray
  const count = items.length


  const toggleMinimized = useCallback(() => {
    setIsMinimized(s => !s)
  }, [setIsMinimized])

  const dismiss = useCallback((notification: Notification) => {
    dismissAction.executeAsync({ notificationId: notification.id })
  }, [dismissAction])

  const clear = useCallback(() => {
    for (const item of items) {
      dismiss(item)
    }
  }, [items, dismiss])

  useEffect(() => {
    if (count <= 0) {
      setIsMinimized(true)
    }
  }, [count, setIsMinimized])

  useInterval(entity.fetchAsync, 5000)

  useMessageListener(NewNotificationMessage, entity.fetchAsync)
  useMessageListener(NotificationDismissedMessage, entity.fetchAsync)

  return {
    notifications: items,
    isMinimized: isMinimized,
    toggleMinimized,
    dismiss,
    clear,
  }
}