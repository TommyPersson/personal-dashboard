package core.notifications.infrastructure

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import core.notifications.domain.Notification
import core.notifications.domain.NotificationRepository
import jakarta.inject.Inject
import jakarta.inject.Singleton
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import utils.Directories
import java.io.File
import javax.xml.crypto.Data

@Singleton
class NotificationRepositoryImpl @Inject constructor(
    private val objectMapper: ObjectMapper
) : NotificationRepository {

    private val dataFile = File(Directories.Data, "notifications.json")

    private val lock = Mutex()

    override suspend fun put(notification: Notification) = lock.withLock {
        val store = loadStore()
        store[notification.id] = notification
        saveStore(store)
    }

    override suspend fun getAll(): List<Notification> = lock.withLock {
        val store = loadStore()
        return store.values.toList().sortedByDescending { it.timestamp }
    }

    override suspend fun getActive(): List<Notification> = lock.withLock {
        val store = loadStore()
        return store.values.toList().filter { !it.isDismissed }.sortedByDescending { it.timestamp }
    }

    override suspend fun getById(id: String): Notification? = lock.withLock {
        val store = loadStore()
        return store[id]
    }

    private suspend fun loadStore(): MutableMap<String, Notification> = withContext(Dispatchers.IO) {
        if (!dataFile.exists()) {
            return@withContext mutableMapOf()
        }

        val data = objectMapper.readValue<DataWrapper>(dataFile)

        data.notifications.associateBy { it.id }.toMutableMap()
    }

    private suspend fun saveStore(store: Map<String, Notification>) = withContext(Dispatchers.IO) {
        objectMapper.writeValue(dataFile, DataWrapper(store.values.toList()))
    }

    private data class DataWrapper(
        val notifications: List<Notification>
    )
}