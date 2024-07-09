package utils

import io.ktor.util.*
import java.net.http.HttpRequest

fun HttpRequest.Builder.withBasicAuth(username: String, password: String): HttpRequest.Builder {
    val secret = "$username:$password".encodeBase64()
    val headerValue = "Basic $secret"
    return header("Authorization", headerValue)
}

fun HttpRequest.Builder.withBearerTokenAuth(accessToken: String): HttpRequest.Builder {
    val headerValue = "Bearer $accessToken"
    return header("Authorization", headerValue)
}