package apps.bitbucket.domain.models

import com.fasterxml.jackson.databind.node.ObjectNode
import java.time.Instant

data class PullRequestBitbucketDTO(
    val id: Long,
    val version: Int,
    val title: String,
    val description: String?,
    val state: PullRequestState,
    val createdDate: Instant,
    val updatedDate: Instant,
    val fromRef: Ref,
    val toRef: Ref,
    val author: Participant,
    val reviewers: List<Participant>,
    val properties: Properties,
    val links: ObjectNode,
) {
    data class Ref(
        val id: String,
        val displayId: String,
        val repository: Repository,
        val type: String,
    )

    data class Repository(
        val id: Long,
        val slug: String,
        val name: String,
        val project: Project
    )

    data class Project(
        val id: Long,
        val key: String,
        val name: String
    )

    data class Participant(
        val user: User,
        val role: ParticipantRole,
        val status: ParticipantStatus,
    )

    data class User(
        val name: String,
        val displayName: String,
    )

    data class Properties(
        val resolvedTaskCount: Int,
        val openTaskCount: Int,
        val commentCount: Int,
    )
}