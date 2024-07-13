package apps.google.domain

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport
import com.google.api.client.json.gson.GsonFactory
import com.google.api.services.calendar.Calendar
import com.google.inject.Provider
import jakarta.inject.Inject
import jakarta.inject.Singleton

@Singleton
class GoogleCalendarApiProvider @Inject constructor(
    private val credentialsProvider: GoogleCredentialsProvider
) : Provider<Calendar> {
    override fun get(): Calendar {
        val credential = credentialsProvider.credential
            ?: throw GoogleErrors.NotYetAuthenticated()

        val transport = GoogleNetHttpTransport.newTrustedTransport()
        val jsonFactory = GsonFactory()
        return Calendar.Builder(transport, jsonFactory, credential).build()
    }
}