package utils

import java.io.File
import java.net.URLEncoder

class FileBasedCache(
    private val name: String
) {
    private val directory = File(Directories.Cache, name).also {
        it.mkdirs()
    }

    fun get(key: String): ByteArray? {
        val file = getFile(key)
        if (file.exists()) {
            return file.readBytes()
        }

        return null
    }

    fun put(key: String, bytes: ByteArray) {
        val file = getFile(key)
        file.writeBytes(bytes)
    }

    private fun getFile(key: String): File {
        val sanitizedKey = URLEncoder.encode(key, "UTF-8")
        return File(directory, sanitizedKey)
    }

    companion object {
        fun create(name: String): FileBasedCache {
            return FileBasedCache(name)
        }
    }
}

suspend fun FileBasedCache.getOrPut(key: String, factory: suspend () -> ByteArray): ByteArray {
    val cachedValue = get(key)
    if (cachedValue != null) {
        return cachedValue
    } else {
        val value = factory()
        put(key, value)
        return value
    }
}