package apps.github.application.contracts

import java.time.Instant

data class GithubNotificationDTO(
    val id: Long,
    val unread: Boolean,
    val lastReadAt: Instant?,
    val reason: String,
    val title: String,
    val type: String,
    val url: String?,
    val repositoryFullName: String,
    val updatedAt: Instant,
)