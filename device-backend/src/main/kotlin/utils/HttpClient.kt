package utils

import kotlin.io.encoding.Base64
import java.net.http.HttpRequest

fun HttpRequest.Builder.withBasicAuth(username: String, password: String): HttpRequest.Builder {
    val secret = Base64.encode("$username:$password".toByteArray())
    val headerValue = "Basic $secret"
    return header("Authorization", headerValue)
}

fun HttpRequest.Builder.withBearerTokenAuth(accessToken: String): HttpRequest.Builder {
    val headerValue = "Bearer $accessToken"
    return header("Authorization", headerValue)
}