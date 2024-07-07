import { Notification } from "@src/apps/notifications/models/Notification.ts"
import { EntityType } from "@src/infrastructure/framework/entities"

export const NotificationsEntity: EntityType<Notification[]> = {
  key: "notifications",
  fetchUrl: "/api/notifications",
  transform: (payload: any) => payload.items as Notification[]
}

