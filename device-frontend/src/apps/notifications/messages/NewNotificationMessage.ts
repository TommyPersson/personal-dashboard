import { type Notification } from "@src/apps/notifications/models/Notification.ts"
import { MessageType } from "@src/infrastructure/framework/messages/MessageType.ts"

export type NewNotificationMessageData = {
  notification: Notification
}

export const NewNotificationMessage: MessageType<NewNotificationMessageData> = {
  type: "NewNotification"
}


