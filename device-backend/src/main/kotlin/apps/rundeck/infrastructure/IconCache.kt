package apps.rundeck.infrastructure

import utils.FileBasedCache
import utils.getOrPut

class IconCache {

    private val cache = FileBasedCache.create("icons")

    suspend fun get(id: String): ByteArray? {
        return cache.get(getKey(id))
    }

    suspend fun put(id: String, bytes: ByteArray) {
        cache.put(getKey(id), bytes)
    }

    suspend fun getOrPut(id: String, factory: suspend () -> ByteArray): ByteArray {
        return cache.getOrPut(getKey(id), factory)
    }

    private fun getKey(id: String) = "$id.png"
}
