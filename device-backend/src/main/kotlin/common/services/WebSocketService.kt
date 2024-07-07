package common.services

import io.ktor.server.websocket.*

interface WebSocketService : MessagePublisher {
    fun startSession(session: WebSocketServerSession)
}

