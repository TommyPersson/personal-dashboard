import { GithubNotification } from "@src/apps/github/models/GithubNotification.ts"
import { GithubNotificationsQuery } from "@src/apps/github/queries/GithubNotificationsQuery.ts"
import { EmptyArray } from "@src/infrastructure/utils"
import { useDeepEqualMemo } from "@src/infrastructure/utils/hooks.ts"
import { useQuery } from "@tanstack/react-query"
import { useCallback } from "react"

export type GithubAppState = {
  notifications: GithubNotification[]
  refresh: () => void
}

export function useGithubState(): GithubAppState {
  const query = useQuery({
    ...GithubNotificationsQuery,
    refetchInterval: 5 * 60_000,
  })

  const { refetch } = query
  const refresh = useCallback(() => void refetch(), [refetch])

  const notifications: GithubNotification[] = query.data ?? EmptyArray

  return useDeepEqualMemo(() => ({
    notifications,
    refresh,
  }), [notifications, refresh])
}
