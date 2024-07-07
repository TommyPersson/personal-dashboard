import { Notification } from "@src/apps/notifications/models/Notification.ts"
import { Message } from "@src/infrastructure/framework/messages/Message"

export type NewNotificationMessage = Message & {
  type: "NewNotification"
  notification: Notification
}

