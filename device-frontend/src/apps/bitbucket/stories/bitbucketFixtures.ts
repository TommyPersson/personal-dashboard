import { BitbucketPullRequest, Participant } from "@src/apps/bitbucket/models/BitbucketPullRequest.ts"
import { BitbucketAppState } from "@src/apps/bitbucket/state/BitbucketAppState.ts"
import { http, HttpResponse } from "msw"
import { fn } from "storybook/test"

const reviewer = (name: string, status: Participant["status"]): Participant => ({ name, role: "REVIEWER", status })

let nextId = 1

function pullRequest(overrides: Partial<BitbucketPullRequest>): BitbucketPullRequest {
  const id = nextId++
  return {
    id,
    version: 1,
    title: `Pull request #${id}`,
    description: "",
    state: "OPEN",
    createdAt: "2026-11-10T08:00:00Z",
    updatedAt: "2026-11-12T14:00:00Z",
    fromRepository: "dashboard",
    fromBranch: `feature/${id}`,
    toRepository: "dashboard",
    toBranch: "main",
    author: { name: "Alex Doe", role: "AUTHOR", status: "UNAPPROVED" },
    reviewers: [reviewer("You", "UNAPPROVED"), reviewer("Sam Roe", "APPROVED")],
    belongsToUser: false,
    userHasApproved: false,
    numComments: 0,
    numResolvedTasks: 0,
    numOpenTasks: 0,
    url: "https://bitbucket.example.com",
    ...overrides,
  }
}

export const pullRequests: BitbucketPullRequest[] = [
  pullRequest({ title: "Add retry to calendar sync", numComments: 4, numOpenTasks: 2 }),
  pullRequest({ title: "Bump Kotlin to 2.3", toRepository: "backend-libs", userHasApproved: true }),
  pullRequest({
    title: "Rework weather caching",
    reviewers: [reviewer("You", "NEEDS_WORK"), reviewer("Sam Roe", "UNAPPROVED")],
    numComments: 11,
    numResolvedTasks: 3,
  }),
  pullRequest({
    title: "Storybook for the frontend",
    belongsToUser: true,
    author: { name: "You", role: "AUTHOR", status: "UNAPPROVED" },
    reviewers: [reviewer("Alex Doe", "APPROVED"), reviewer("Sam Roe", "APPROVED")],
    numComments: 2,
  }),
  pullRequest({ title: "Remove legacy layout code", state: "DECLINED" }),
  pullRequest({ title: "Fix pomodoro reset", state: "MERGED", reviewers: [reviewer("You", "APPROVED")] }),
  pullRequest({ title: "Add hot-key sections", state: "MERGED", reviewers: [reviewer("You", "APPROVED")] }),
]

export function bitbucketState(overrides: Partial<BitbucketAppState> = {}): BitbucketAppState {
  return {
    pullRequests,
    error: null,
    refresh: fn(),
    ...overrides,
  }
}

export const bitbucketHandlers = [
  http.get("/api/apps/bitbucket/pull-requests", () => HttpResponse.json({ pullRequests })),
]
