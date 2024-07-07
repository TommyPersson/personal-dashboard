import { Message } from "@src/infrastructure/framework/messages/Message"

export type NotificationDismissedMessage = Message & {
  type: "NotificationDismissed"
  notificationId: string
}

