package apps.bitbucket.application.contracts

import apps.bitbucket.domain.models.ParticipantRole
import apps.bitbucket.domain.models.ParticipantStatus
import apps.bitbucket.domain.models.PullRequestState
import java.time.Instant

data class PullRequestDTO(
    val id: Long,
    val version: Int,
    val title: String,
    val description: String,
    val state: PullRequestState,
    val createdAt: Instant,
    val updatedAt: Instant,
    val fromRepository: String,
    val fromBranch: String,
    val toRepository: String,
    val toBranch: String,
    val author: Participant,
    val reviewers: List<Participant>,
    val belongsToUser: Boolean,
    val userHasApproved: Boolean,
    val numComments: Int,
    val numResolvedTasks: Int,
    val numOpenTasks: Int,
    val url: String,
) {
    data class Participant(
        val name: String,
        val role: ParticipantRole,
        val status: ParticipantStatus,
    )
}