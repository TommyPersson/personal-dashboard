package core.notifications.application.contracts.messages

import com.fasterxml.jackson.annotation.JsonTypeName
import common.services.Message
import core.notifications.domain.Notification

@JsonTypeName("NewNotification")
data class NewNotificationMessageDTO(
    val notification: Notification
) : Message

