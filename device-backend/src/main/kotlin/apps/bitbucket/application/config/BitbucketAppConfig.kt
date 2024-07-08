package apps.bitbucket.application.config

data class BitbucketAppConfig(
    val bitbucketServer: BitbucketServer,
) {
    data class BitbucketServer(
        val baseUrl: String,
        val authentication: Authentication,
    ) {
        data class Authentication(
            val username: String,
            val accessToken: String,
        )
    }
}