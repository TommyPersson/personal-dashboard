package apps.github.application.contracts

data class GetGithubNotificationsResponseDTO(
    val notifications: List<GithubNotificationDTO>
)