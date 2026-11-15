import { GithubNotificationDTO, GithubNotificationSchema } from "@src/apps/github/models/GithubNotification.ts"
import { GithubAppState } from "@src/apps/github/state/GithubAppState.ts"
import { http, HttpResponse } from "msw"
import { fn } from "storybook/test"

/** As the backend sends them. */
export const githubNotificationDTOs: GithubNotificationDTO[] = [
  {
    id: 1,
    unread: true,
    lastReadAt: null,
    reason: "review_requested",
    title: "Add Storybook setup for the frontend",
    type: "PullRequest",
    url: null,
    repositoryFullName: "example/personal-dashboard",
    updatedAt: "2026-11-13T08:12:00Z",
  },
  {
    id: 2,
    unread: true,
    lastReadAt: null,
    reason: "subscribed",
    title: "v2.4.0",
    type: "Release",
    url: null,
    repositoryFullName: "example/winctrl",
    updatedAt: "2026-11-12T17:40:00Z",
  },
  {
    id: 3,
    unread: true,
    lastReadAt: "2026-11-10T10:00:00Z",
    reason: "mention",
    title: "Ideas for the lock screen layout",
    type: "Discussion",
    url: null,
    repositoryFullName: "example/personal-dashboard",
    updatedAt: "2026-11-11T09:05:00Z",
  },
  {
    id: 4,
    unread: true,
    lastReadAt: null,
    reason: "subscribed",
    title: "CI is flaky on Windows runners",
    type: "Issue",
    url: null,
    repositoryFullName: "example/personal-dashboard",
    updatedAt: "2026-11-10T13:30:00Z",
  },
]

export const githubNotifications = githubNotificationDTOs.map(it => GithubNotificationSchema.parse(it))

export function githubState(overrides: Partial<GithubAppState> = {}): GithubAppState {
  return {
    notifications: githubNotifications,
    markAllAsRead: fn(),
    refresh: fn(),
    ...overrides,
  }
}

export const githubHandlers = [
  http.get("/api/apps/github/notifications", () => HttpResponse.json({ notifications: githubNotificationDTOs })),
]
