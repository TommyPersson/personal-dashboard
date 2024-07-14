package apps.calendar.domain

import io.ktor.http.*
import utils.HttpException

object CalendarErrors {
    class NotYetAuthenticatedToGoogleCalendar : HttpException(
        status = HttpStatusCode.BadRequest,
        errorCode = "E-CALENDAR-NotYetAuthenticatedToGoogleCalendar",
        errorMessage = "The application has not yet been authenticated to Google Calendar."
    )
}