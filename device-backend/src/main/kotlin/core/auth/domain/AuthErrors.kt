package core.auth.domain

import io.ktor.http.*
import utils.HttpException

object AuthErrors {
    class Unauthorized : HttpException(HttpStatusCode.Unauthorized)
}