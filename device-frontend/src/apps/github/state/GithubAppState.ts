import { MarkAllNotificationsAsRead } from "@src/apps/github/actions/MarkAllNotificationsAsRead.ts"
import { GithubNotificationsEntity } from "@src/apps/github/entities/GithubNotificationsEntity.ts"
import { GithubNotification } from "@src/apps/github/models/GithubNotification.ts"
import { useEntity } from "@src/infrastructure/framework/entities"
import { useAction } from "@src/infrastructure/framework/entities/useAction.tsx"
import { useInterval } from "@src/infrastructure/hooks/useInterval.ts"
import { EmptyArray } from "@src/infrastructure/utils"
import { useCallback } from "react"

export type GithubAppState = {
  notifications: GithubNotification[]
  markAllAsRead: () => void
  refresh: () => void
}

export function useGithubState(): GithubAppState {
  const entity = useEntity(GithubNotificationsEntity, {
    fetchOnMount: true,
    clearOnFetch: false,
  })

  const markAllAsReadAction = useAction(MarkAllNotificationsAsRead)

  const markAllAsRead = useCallback(async () => {
    await markAllAsReadAction.execute()
    entity.fetchAsync
  }, [markAllAsReadAction.execute, entity.fetchAsync])

  useInterval(entity.fetchAsync, 5 * 60_000)

  const notifications: GithubNotification[] = entity.value ?? EmptyArray

  return {
    notifications,
    markAllAsRead,
    refresh: entity.fetchAsync,
  }
}