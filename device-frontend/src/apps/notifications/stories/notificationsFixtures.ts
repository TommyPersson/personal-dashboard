import { Notification } from "@src/apps/notifications/models/Notification.ts"
import { http, HttpResponse } from "msw"

export const notifications: Notification[] = [
  {
    id: "n1",
    title: "Build failed",
    description: "personal-dashboard #142 failed on main",
    thumbnail: null,
    source: "CI",
    timestamp: "2026-11-13T08:55:00Z",
  },
  {
    id: "n2",
    title: "New message from Alex",
    description: "Are we still on for the demo at 13:00?",
    thumbnail: null,
    source: "Slack",
    timestamp: "2026-11-13T08:31:00Z",
  },
  {
    id: "n3",
    title: "Disk space low",
    description: "",
    thumbnail: null,
    source: "Windows",
    timestamp: "2026-11-12T22:10:00Z",
  },
]

export const notificationsHandlers = [
  http.get("/api/notifications", () => HttpResponse.json({ items: notifications })),
]
