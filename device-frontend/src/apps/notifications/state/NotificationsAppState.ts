import { NewNotificationMessage, NotificationDismissedMessage } from "@src/apps/notifications/messages"
import { Notification } from "@src/apps/notifications/models/Notification.ts"
import { NotificationsQuery, NotificationsQueryKey } from "@src/apps/notifications/queries/NotificationsQuery.ts"
import { useMessageListener } from "@src/infrastructure/hooks/useMessageListener.tsx"
import { EmptyArray } from "@src/infrastructure/utils"
import { useDeepEqualMemo } from "@src/infrastructure/utils/hooks.ts"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback, useEffect, useState } from "react"

export type NotificationsAppState = {
  notifications: Notification[]
  isMinimized: boolean
  toggleMinimized: () => void
}

export function useNotificationsAppState(): NotificationsAppState {
  const queryClient = useQueryClient()

  const query = useQuery({
    ...NotificationsQuery,
    refetchInterval: 5000,
  })

  const [isMinimized, setIsMinimized] = useState(false)

  const items = query.data ?? EmptyArray
  const count = items.length

  const toggleMinimized = useCallback(() => {
    setIsMinimized(s => !s)
  }, [setIsMinimized])

  useEffect(() => {
    if (count <= 0) {
      setIsMinimized(true)
    }
  }, [count, setIsMinimized])

  const invalidateNotifications = useCallback(() => {
    return queryClient.invalidateQueries({ queryKey: NotificationsQueryKey })
  }, [queryClient])

  useMessageListener(NewNotificationMessage, invalidateNotifications)
  useMessageListener(NotificationDismissedMessage, invalidateNotifications)

  return useDeepEqualMemo(() => ({
    notifications: items,
    isMinimized: isMinimized,
    toggleMinimized,
  }), [items, isMinimized, toggleMinimized])
}
