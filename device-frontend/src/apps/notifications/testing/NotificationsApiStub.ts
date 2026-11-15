import { NotificationDTO } from "@src/apps/notifications/models/Notification.ts"
import { notificationDTOs } from "@src/apps/notifications/stories/notificationsFixtures.ts"
import { apiError } from "@src/testing/apiError.ts"
import { server } from "@src/testing/msw.ts"
import { http, HttpResponse } from "msw"

/** The notifications API as the backend behaves, with its state open to the test. */
export type NotificationsApiStub = {
  notifications: NotificationDTO[]
  /** IDs in the order they were dismissed. */
  dismissedIds: string[]
}

/** Registers the stub's handlers on the test server; call it in `beforeEach`. */
export function stubNotificationsApi(notifications: NotificationDTO[] = notificationDTOs): NotificationsApiStub {
  const stub: NotificationsApiStub = {
    notifications: [...notifications],
    dismissedIds: [],
  }

  server.use(
    http.get("/api/notifications", () => {
      return HttpResponse.json({ items: stub.notifications })
    }),
    http.post<{ id: string }>("/api/notifications/:id/actions/dismiss", ({ params }) => {
      if (!stub.notifications.some(it => it.id === params.id)) {
        return apiError(404, "NOT_FOUND", `No notification ${params.id}`)
      }
      stub.notifications = stub.notifications.filter(it => it.id !== params.id)
      stub.dismissedIds.push(params.id)
      return HttpResponse.json({})
    }),
  )

  return stub
}
