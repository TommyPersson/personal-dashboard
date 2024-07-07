import { useEffect } from "react"
import { Message } from "../framework/messages/Message"

export function useMessageListener<T extends Message>(type: string, fn: (message: T) => void) {
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data.type === type) {
        fn(e.data)
      }
    }

    window.addEventListener("message", handler)

    return () => {
      window.removeEventListener("message", handler)
    }
  }, [type, fn])
}