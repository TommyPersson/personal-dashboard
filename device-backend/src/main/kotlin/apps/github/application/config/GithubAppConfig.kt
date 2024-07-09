package apps.github.application.config

data class GithubAppConfig(
    val github: Github,
) {
    data class Github(
        val accessToken: String,
    )
}