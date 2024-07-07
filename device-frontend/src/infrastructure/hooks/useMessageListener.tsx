import { MessageType } from "@src/infrastructure/framework/messages/MessageType.ts"
import { useEffect } from "react"

export function useMessageListener<T>(type: MessageType<T>, fn: (message: T) => void) {
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data.type === type.type) {
        fn(e.data)
      }
    }

    window.addEventListener("message", handler)

    return () => {
      window.removeEventListener("message", handler)
    }
  }, [type, fn])
}