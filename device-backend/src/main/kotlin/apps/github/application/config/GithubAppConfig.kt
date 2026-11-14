package apps.github.application.config

data class GithubAppConfig(
    val github: Github,
) {
    data class Github(
        val accessToken: String,
        val apiUrl: String = "https://api.github.com",
    )
}