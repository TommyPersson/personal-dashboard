package core.notifications.application.queries

import core.notifications.application.contracts.GetNotificationsResponseDTO
import core.notifications.application.contracts.toDTO
import core.notifications.domain.NotificationRepository
import framework.mediator.Query
import framework.mediator.QueryHandler
import jakarta.inject.Inject

class GetNotifications : Query<GetNotificationsResponseDTO>

class GetNotificationsQueryHandler @Inject constructor(
    private val repository: NotificationRepository,
): QueryHandler<GetNotifications, GetNotificationsResponseDTO> {

    override suspend fun handle(query: GetNotifications): GetNotificationsResponseDTO {
        val notifications = repository.getActive().map { it.toDTO() }
        return GetNotificationsResponseDTO(
            items = notifications
        )
    }
}