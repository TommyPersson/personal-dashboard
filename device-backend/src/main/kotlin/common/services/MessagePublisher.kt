package common.services

interface MessagePublisher {
    suspend fun publish(message: Message)
}