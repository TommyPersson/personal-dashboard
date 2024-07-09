package apps.github.domain.model

import java.time.Instant

data class GithubApiNotificationDTO(
    val id: Long,
    val unread: Boolean,
    val reason: String,
    val updated_at: Instant,
    val last_read_at: Instant?,
    val subject: Subject,
    val repository: Repository,
    val url: String,
) {
    data class Subject(
        val title: String,
        val type: String,
        val url: String?,
        val latest_comment_url: String?,
    )

    data class Repository(
        val id: Long,
        val name: String,
        val full_name: String,
    )
}