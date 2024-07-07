package core.notifications.application.contracts.messages

import com.fasterxml.jackson.annotation.JsonTypeName
import common.services.Message

@JsonTypeName("NotificationDismissed")
data class NotificationDismissedMessageDTO(
    val notificationId: String
) : Message