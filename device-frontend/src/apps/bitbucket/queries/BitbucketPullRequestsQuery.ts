import { BitbucketPullRequestSchema } from "@src/apps/bitbucket/models/BitbucketPullRequest.ts"
import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { queryOptions } from "@tanstack/react-query"
import { z } from "zod"

export const BitbucketPullRequestsQueryKey = ["bitbucket", "pullRequests"] as const

const BitbucketPullRequestsResponseSchema = z.object({
  pullRequests: z.array(BitbucketPullRequestSchema),
})

export const BitbucketPullRequestsQuery = queryOptions({
  queryKey: BitbucketPullRequestsQueryKey,
  queryFn: async () => {
    const dto = await apiClient.get<unknown>("/api/apps/bitbucket/pull-requests")
    return BitbucketPullRequestsResponseSchema.parse(dto).pullRequests
  },
})
