package apps.bitbucket.application.contracts

data class GetPullRequestsResponseDTO(
    val pullRequests: List<PullRequestDTO>
)

