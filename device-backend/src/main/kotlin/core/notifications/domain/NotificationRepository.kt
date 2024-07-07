package core.notifications.domain

interface NotificationRepository {
    suspend fun put(notification: Notification)

    suspend fun getAll(): List<Notification>

    suspend fun getActive(): List<Notification>

    suspend fun getById(id: String): Notification?
}