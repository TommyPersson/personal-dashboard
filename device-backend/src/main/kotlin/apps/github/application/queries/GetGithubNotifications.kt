package apps.github.application.queries

import apps.github.application.contracts.GetGithubNotificationsResponseDTO
import apps.github.application.contracts.GithubNotificationDTO
import apps.github.domain.GithubApiClient
import framework.mediator.Query
import framework.mediator.QueryHandler
import jakarta.inject.Inject

class GetGithubNotifications : Query<GetGithubNotificationsResponseDTO>

class GetGithubNotificationsQueryHandler @Inject constructor(
    private val githubApiClient: GithubApiClient,
) :
    QueryHandler<GetGithubNotifications, GetGithubNotificationsResponseDTO> {

    override suspend fun handle(query: GetGithubNotifications): GetGithubNotificationsResponseDTO {
        val notifications = githubApiClient.getNotifications().map {
            GithubNotificationDTO(
                id = it.id,
                unread = it.unread,
                lastReadAt = it.last_read_at,
                reason = it.reason,
                title = it.subject.title,
                type = it.subject.type,
                url = it.subject.url,
                repositoryFullName = it.repository.full_name,
                updatedAt = it.updated_at
            )
        }

        return GetGithubNotificationsResponseDTO(notifications)
    }
}

