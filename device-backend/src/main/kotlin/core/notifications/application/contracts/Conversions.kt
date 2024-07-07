package core.notifications.application.contracts

import core.notifications.domain.Notification

fun Notification.toDTO() = NotificationDTO(
    id = id,
    title = title,
    description = description,
    thumbnail = thumbnail,
    timestamp = timestamp,
    source = source,
)