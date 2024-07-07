package core.notifications.application.commands

import common.services.MessagePublisher
import core.notifications.application.contracts.messages.NotificationDismissedMessageDTO
import core.notifications.domain.NotificationRepository
import framework.mediator.Command
import framework.mediator.RequestHandler
import jakarta.inject.Inject

class DismissNotification(val notificationId: String) : Command<Unit>

class DismissNotificationCommandHandler @Inject constructor(
    private val repository: NotificationRepository,
    private val messagePublisher: MessagePublisher,
) : RequestHandler<DismissNotification, Unit> {

    override suspend fun handle(request: DismissNotification) {
        val notification = repository.getById(request.notificationId)
            ?: TODO("error handling")

        if (notification.isDismissed) {
            return
        }

        notification.dismiss()

        repository.put(notification)
        messagePublisher.publish(NotificationDismissedMessageDTO(notification.id))
    }
}

