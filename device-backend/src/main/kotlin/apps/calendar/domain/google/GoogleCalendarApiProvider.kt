package apps.calendar.domain.google

import apps.calendar.domain.CalendarErrors
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport
import com.google.api.client.json.gson.GsonFactory
import com.google.api.services.calendar.Calendar

class GoogleCalendarApiProvider(
    val credentialsProvider: GoogleCredentialsProvider
) {
    fun get(): Calendar {
        val credential = credentialsProvider.credential
            ?: throw CalendarErrors.NotYetAuthenticatedToGoogleCalendar()

        val transport = GoogleNetHttpTransport.newTrustedTransport()
        val jsonFactory = GsonFactory()
        return Calendar.Builder(transport, jsonFactory, credential).build()
    }
}