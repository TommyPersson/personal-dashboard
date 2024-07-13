package apps.google.domain

import GoogleAppConfig
import com.google.api.client.auth.oauth2.Credential
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport
import com.google.api.client.json.gson.GsonFactory
import com.google.api.client.util.store.FileDataStoreFactory
import com.google.api.services.calendar.CalendarScopes
import jakarta.inject.Inject
import jakarta.inject.Singleton
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import utils.Directories
import java.io.File

@Singleton
class GoogleCredentialsProvider @Inject constructor(
    private val config: GoogleAppConfig,
) {

    private var _credential: Credential? = null

    val credential: Credential? get() = _credential

    private val scopes = listOf(
        CalendarScopes.CALENDAR_EVENTS_READONLY,
        CalendarScopes.CALENDAR_READONLY,
        CalendarScopes.CALENDAR_SETTINGS_READONLY
    )

    suspend fun refresh() = withContext(Dispatchers.IO) {
        val transport = GoogleNetHttpTransport.newTrustedTransport()
        val dataStore = FileDataStoreFactory(File(Directories.Data, "google"))
        val jsonFactory = GsonFactory()
        val secrets = GoogleClientSecrets.load(jsonFactory, File(config.clientSecretJsonFilePath).reader())

        val flow = GoogleAuthorizationCodeFlow.Builder(transport, jsonFactory, secrets, scopes).also {
            it.setDataStoreFactory(dataStore)
        }.build()

        _credential = AuthorizationCodeInstalledApp(flow, LocalServerReceiver()).authorize(config.emailAddress)
    }
}