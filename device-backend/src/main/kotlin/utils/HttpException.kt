package utils

import io.ktor.http.*

open class HttpException(
    val status: HttpStatusCode,
    val errorCode: String,
    val errorMessage: String,
) : Exception()