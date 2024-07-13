package core.auth.domain

import io.ktor.http.*
import utils.HttpException

object AuthErrors {
    class InvalidPinCode : HttpException(
        status = HttpStatusCode.Unauthorized,
        errorCode = "E-CORE-InvalidPinCode",
        errorMessage = "Unable to unlock device with incorrect pin code"
    )
}