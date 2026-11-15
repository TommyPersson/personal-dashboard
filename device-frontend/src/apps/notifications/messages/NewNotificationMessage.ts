import { type NotificationDTO } from "@src/apps/notifications/models/Notification.ts"
import { MessageType } from "@src/infrastructure/framework/messages/MessageType.ts"

export type NewNotificationMessageData = {
  /** Not parsed yet: messages carry the notification as the backend sends it. */
  notification: NotificationDTO
}

export const NewNotificationMessage: MessageType<NewNotificationMessageData> = {
  type: "NewNotification"
}


