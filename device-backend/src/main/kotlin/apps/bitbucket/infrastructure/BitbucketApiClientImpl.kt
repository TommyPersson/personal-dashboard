package apps.bitbucket.infrastructure

import BitbucketApiClient
import apps.bitbucket.application.config.BitbucketAppConfig
import apps.bitbucket.domain.models.PaginatedBitbucketResponseDTO
import apps.bitbucket.domain.models.PullRequestBitbucketDTO
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import io.ktor.util.*
import jakarta.inject.Inject
import jakarta.inject.Singleton
import kotlinx.coroutines.future.await
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse.BodyHandlers

@Singleton
class BitbucketApiClientImpl @Inject constructor(
    private val config: BitbucketAppConfig,
    private val objectMapper: ObjectMapper,
) : BitbucketApiClient {

    private val httpClient = HttpClient.newBuilder()
        .followRedirects(HttpClient.Redirect.ALWAYS)
        .build()

    override suspend fun getUserDashboard(): PaginatedBitbucketResponseDTO<PullRequestBitbucketDTO> {
        val uri = URI.create("${config.bitbucketServer.baseUrl}/rest/api/latest/dashboard/pull-requests")
        val request = HttpRequest.newBuilder()
            .GET()
            .uri(uri)
            .withBasicAuth(config.bitbucketServer.authentication.username, config.bitbucketServer.authentication.accessToken)
            .build()

        val response = httpClient.sendAsync(request, BodyHandlers.ofString()).await()

        if (response.statusCode() >= 300) {
            TODO("proper error")
        }

        return objectMapper.readValue(response.body())
    }
}

fun HttpRequest.Builder.withBasicAuth(username: String, password: String): HttpRequest.Builder {
    val secret = "$username:$password".encodeBase64()
    val headerValue = "Basic $secret"
    return header("Authorization", headerValue)
}