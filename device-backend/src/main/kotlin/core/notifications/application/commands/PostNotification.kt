package core.notifications.application.commands

import common.services.MessagePublisher
import core.notifications.application.contracts.NotificationDTO
import core.notifications.application.contracts.messages.NewNotificationMessageDTO
import core.notifications.domain.Notification
import core.notifications.domain.NotificationRepository
import framework.mediator.Command
import framework.mediator.RequestHandler
import jakarta.inject.Inject

class PostNotification(val notification: NotificationDTO) : Command<Unit>

class PostNotificationCommandHandler @Inject constructor(
    private val repository: NotificationRepository,
    private val messagePublisher: MessagePublisher,
) : RequestHandler<PostNotification, Unit> {

    override suspend fun handle(request: PostNotification) {
        val notification = Notification(
            id = request.notification.id,
            title = request.notification.title,
            description = request.notification.description,
            thumbnail = request.notification.thumbnail,
            timestamp = request.notification.timestamp,
            source = request.notification.source
        )

        repository.put(notification)
        messagePublisher.publish(NewNotificationMessageDTO(notification))
    }
}

