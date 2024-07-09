package apps.github.infrastructure

import apps.github.application.config.GithubAppConfig
import apps.github.domain.GithubApiClient
import apps.github.domain.model.GithubApiNotificationDTO
import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.inject.Inject
import kotlinx.coroutines.future.await
import utils.withBearerTokenAuth
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpRequest.BodyPublishers
import java.net.http.HttpResponse.BodyHandlers
import java.time.Instant

class GithubApiClientImpl @Inject constructor(
    private val config: GithubAppConfig,
    private val objectMapper: ObjectMapper
) : GithubApiClient {

    private val httpClient = HttpClient.newBuilder()
        .followRedirects(HttpClient.Redirect.ALWAYS)
        .build()

    override suspend fun getNotifications(): List<GithubApiNotificationDTO> {
        val uri = URI.create("https://api.github.com/notifications")
        val request = HttpRequest.newBuilder()
            .GET()
            .uri(uri)
            .withBearerTokenAuth(config.github.accessToken)
            .build()

        val response = httpClient.sendAsync(request, BodyHandlers.ofString()).await()
        if (response.statusCode() >= 300) {
            TODO()
        }

        val dtos = objectMapper.readValue(response.body(), Array<GithubApiNotificationDTO>::class.java)

        return dtos.toList()
    }

    override suspend fun markAllNotificationsAsRead() {
        val lastReadAt = Instant.now().toString()

        val uri = URI.create("https://api.github.com/notifications")
        val request = HttpRequest.newBuilder()
            .PUT(BodyPublishers.ofString("""{ "last_read_at": "$lastReadAt", "read": true }"""))
            .uri(uri)
            .withBearerTokenAuth(config.github.accessToken)
            .build()

        val response = httpClient.sendAsync(request, BodyHandlers.ofString()).await()
        if (response.statusCode() >= 300) {
            TODO()
        }
    }
}