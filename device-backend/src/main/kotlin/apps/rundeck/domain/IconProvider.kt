package apps.rundeck.domain

import java.net.URI

interface IconProvider {
    suspend fun getForUrl(uri: URI): ByteArray
    suspend fun getForFile(file: String): ByteArray
}