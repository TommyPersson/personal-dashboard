
export type MessageType<TMessage, TPayload = TMessage> = {
  type: string
  transform?: (raw: TPayload) => TMessage
}