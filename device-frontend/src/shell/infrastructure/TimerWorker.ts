self.setInterval(() => {
  self.postMessage({ type: "second-timer" })
}, 1000)

// TODO not just a timer worker anymore

let webSocket: WebSocket | null = null

function openWebSocket() {
  if (webSocket && webSocket.readyState !== WebSocket.CLOSED) {
    return
  }

  webSocket = new WebSocket(`ws://${self.location.host}/api/websocket`)

  webSocket.addEventListener("open", (e) => {
    console.log("Websocket open", e)
  })

  webSocket.addEventListener("message", (e) => {
    console.log("Websocket message", e)
    try {
      const message = JSON.parse(e.data)
      self.postMessage(message)
    } catch (e) {
      // no-op
    }
  })
}

setInterval(() => {
  openWebSocket()
  webSocket?.send(JSON.stringify({ type: "ping" }))
}, 10_000)

openWebSocket()