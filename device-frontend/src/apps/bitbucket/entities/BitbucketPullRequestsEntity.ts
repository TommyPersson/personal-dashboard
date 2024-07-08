import { BitbucketPullRequest } from "@src/apps/bitbucket/models/BitbucketPullRequest.ts"
import { EntityType } from "@src/infrastructure/framework/entities"

export const BitbucketPullRequestsEntity: EntityType<BitbucketPullRequest[]> = {
  key: "bitbucket/bitbucketPullRequests",
  fetchUrl: "/api/apps/bitbucket/pull-requests",
  transform: (payload) => payload.pullRequests
}

