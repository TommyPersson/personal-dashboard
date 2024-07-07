package core.notifications.application.contracts

import java.time.Instant

class NotificationDTO(
    val id: String,
    val title: String,
    val description: String,
    val thumbnail: ByteArray?,
    val timestamp: Instant,
    val source: String,
)