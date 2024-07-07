import { MessageType } from "@src/infrastructure/framework/messages/MessageType.ts"

export type NotificationDismissedMessageData = {
  notificationId: string
}


export const NotificationDismissedMessage: MessageType<NotificationDismissedMessageData> = {
  type: "NotificationDismissed"
}

