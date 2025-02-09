package apps.rundeck.infrastructure

import apps.rundeck.domain.IconProvider
import common.winctrl.WinCtrlFacade
import jakarta.inject.Inject
import kotlinx.coroutines.future.await
import java.io.File
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse.BodyHandlers

class IconProviderImpl @Inject constructor(
    private val urlIconProvider: UrlIconProvider,
    private val fileIconProvider: FileIconProvider,
) : IconProvider {

    private val iconCache = IconCache()

    override suspend fun getForUrl(uri: URI): ByteArray {
        val iconId = "url-$uri"

        return iconCache.getOrPut(iconId) {
            urlIconProvider.get(uri)
        }
    }

    override suspend fun getForFile(file: File): ByteArray {
        val iconId = "file-${file.absolutePath}"

        return iconCache.getOrPut(iconId) {
            fileIconProvider.getForFile(file)
        }
    }
}

class UrlIconProvider {

    private val httpClient = HttpClient.newBuilder()
        .followRedirects(HttpClient.Redirect.ALWAYS)
        .build()

    suspend fun get(uri: URI): ByteArray {
        val iconHorseUri = "https://icon.horse/icon/${uri.host}"
        val request = HttpRequest.newBuilder().GET().uri(URI.create(iconHorseUri)).build()
        val response = httpClient.sendAsync(request, BodyHandlers.ofByteArray()).await()

        if (response.statusCode() >= 300) {
            TODO("proper error")
        }

        return response.body()
    }
}

class FileIconProvider @Inject constructor(
    private val winCtrl: WinCtrlFacade
) {
    suspend fun getForFile(file: File): ByteArray {
        val iconBytes = winCtrl.executables.getIconImageBytes(file.absolutePath)
        return iconBytes
    }
}
