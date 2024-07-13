package apps.google.domain

import io.ktor.http.*
import utils.HttpException

object GoogleErrors {
    class NotYetAuthenticated : HttpException(
        status = HttpStatusCode.BadRequest,
        errorCode = "E-GOOGLE-NotYetAuthenticated",
        errorMessage = "The application has not yet been authenticated"
    )
}