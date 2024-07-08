package apps.bitbucket.application.queries

import BitbucketApiClient
import apps.bitbucket.application.config.BitbucketAppConfig
import apps.bitbucket.application.contracts.GetPullRequestsResponseDTO
import apps.bitbucket.application.contracts.PullRequestDTO
import apps.bitbucket.domain.models.ParticipantStatus
import com.fasterxml.jackson.databind.node.ArrayNode
import framework.mediator.Query
import framework.mediator.QueryHandler
import jakarta.inject.Inject

class GetPullRequests : Query<GetPullRequestsResponseDTO>

class GetPullRequestsQueryHandler @Inject constructor(
    private val bitbucketApiClient: BitbucketApiClient,
    private val config: BitbucketAppConfig,
) : QueryHandler<GetPullRequests, GetPullRequestsResponseDTO> {

    override suspend fun handle(query: GetPullRequests): GetPullRequestsResponseDTO {
        val bitbucketResponse = bitbucketApiClient.getUserDashboard()

        val currentUsername = config.bitbucketServer.authentication.username

        return GetPullRequestsResponseDTO(
            pullRequests = bitbucketResponse.values.map { pr ->
                PullRequestDTO(
                    id = pr.id,
                    version = pr.version,
                    title = pr.title,
                    description = pr.description ?: "",
                    state = pr.state,
                    createdAt = pr.createdDate,
                    updatedAt = pr.updatedDate,
                    fromRepository = pr.fromRef.repository.name,
                    fromBranch = pr.fromRef.displayId,
                    toRepository = pr.toRef.repository.name,
                    toBranch = pr.toRef.displayId,
                    author = PullRequestDTO.Participant(
                        name = pr.author.user.displayName,
                        role = pr.author.role,
                        status = pr.author.status,
                    ),
                    reviewers = pr.reviewers.map { reviewer ->
                        PullRequestDTO.Participant(
                            name = reviewer.user.displayName,
                            role = reviewer.role,
                            status = reviewer.status,
                        )
                    },
                    belongsToUser = pr.author.user.name == currentUsername,
                    userHasApproved = pr.reviewers.any { it.user.name == currentUsername && it.status == ParticipantStatus.APPROVED },
                    numComments = pr.properties.commentCount,
                    numResolvedTasks = pr.properties.resolvedTaskCount,
                    numOpenTasks = pr.properties.openTaskCount,
                    url = (pr.links.get("self") as ArrayNode).first().get("href").textValue(),
                )
            }
        )
    }

}