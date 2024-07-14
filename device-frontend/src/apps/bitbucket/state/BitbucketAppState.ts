import { BitbucketPullRequestsEntity } from "@src/apps/bitbucket/entities/BitbucketPullRequestsEntity.ts"
import { BitbucketPullRequest } from "@src/apps/bitbucket/models/BitbucketPullRequest.ts"
import { useEntity } from "@src/infrastructure/framework/entities"
import { useInterval } from "@src/infrastructure/hooks/useInterval.ts"
import { EmptyArray } from "@src/infrastructure/utils"
import { useDeepEqualMemo } from "@src/infrastructure/utils/hooks.ts"

export type BitbucketAppState = {
  pullRequests: BitbucketPullRequest[]
  refresh: () => void
}

export function useBitbucketAppState(): BitbucketAppState {
  const entity = useEntity(BitbucketPullRequestsEntity, {
    fetchOnMount: true,
    clearOnFetch: false,
  })

  useInterval(entity.fetchAsync, 60_000)

  const pullRequests: BitbucketPullRequest[] = entity.value ?? EmptyArray

  return useDeepEqualMemo(() => ({
    pullRequests,
    refresh: entity.fetchAsync,
  }), [pullRequests])
}