package apps.bitbucket.domain.models

data class PaginatedBitbucketResponseDTO<T>(
    val size: Int,
    val limit: Int,
    val start: Int,
    val isLastPage: Boolean,
    val values: List<T>
)