import { BitbucketPullRequest } from "@src/apps/bitbucket/models/BitbucketPullRequest.ts"
import { BitbucketPullRequestsQuery } from "@src/apps/bitbucket/queries/BitbucketPullRequestsQuery.ts"
import { EmptyArray } from "@src/infrastructure/utils"
import { useDeepEqualMemo } from "@src/infrastructure/utils/hooks.ts"
import { useQuery } from "@tanstack/react-query"
import { useCallback } from "react"

export type BitbucketAppState = {
  pullRequests: BitbucketPullRequest[]
  error: Error | null
  refresh: () => void
}

export function useBitbucketAppState(): BitbucketAppState {
  const query = useQuery({
    ...BitbucketPullRequestsQuery,
    refetchInterval: 60_000,
  })

  const { refetch } = query
  const refresh = useCallback(() => void refetch(), [refetch])

  const pullRequests: BitbucketPullRequest[] = query.data ?? EmptyArray

  return useDeepEqualMemo(() => ({
    pullRequests,
    error: query.error,
    refresh,
  }), [pullRequests, query.error, refresh])
}
