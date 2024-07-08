import apps.bitbucket.domain.models.PaginatedBitbucketResponseDTO
import apps.bitbucket.domain.models.PullRequestBitbucketDTO

interface BitbucketApiClient {
    suspend fun getUserDashboard(): PaginatedBitbucketResponseDTO<PullRequestBitbucketDTO>
}

