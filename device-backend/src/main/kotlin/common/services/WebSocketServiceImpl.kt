package common.services

import io.ktor.server.websocket.*
import io.ktor.websocket.*
import jakarta.inject.Inject
import jakarta.inject.Singleton
import java.util.*

@Singleton
class WebSocketServiceImpl @Inject constructor() : WebSocketService {

    private val sessions = Collections.synchronizedSet(mutableSetOf<WebSocketServerSession>())

    override fun startSession(session: WebSocketServerSession) {
        sessions.add(session)
    }

    override suspend fun publish(message: Message) {
        val ongoingSessions = sessions.toList()

        ongoingSessions.forEach { session ->
            try {
                session.sendSerialized(message)
            } catch (e: Exception) {
                sessions.remove(session)
            }
        }
    }
}