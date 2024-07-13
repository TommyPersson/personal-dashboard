package utils

import io.ktor.http.*

open class HttpException(val status: HttpStatusCode) : Exception()