import { ClaudeSessionDTO } from "@src/apps/claude-code/models/ClaudeSession.ts"
import { MessageType } from "@src/infrastructure/framework/messages/MessageType.ts"

export type ClaudeSessionUpdatedMessageData = {
  session: ClaudeSessionDTO
}

export const ClaudeSessionUpdatedMessage: MessageType<ClaudeSessionUpdatedMessageData> = {
  type: "ClaudeSessionUpdated",
}

export type ClaudeSessionRemovedMessageData = {
  sessionId: string
}

export const ClaudeSessionRemovedMessage: MessageType<ClaudeSessionRemovedMessageData> = {
  type: "ClaudeSessionRemoved",
}
