package apps.claude.infrastructure

import apps.claude.domain.ClaudeSession
import apps.claude.domain.ClaudeSessionRepository
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import jakarta.inject.Inject
import jakarta.inject.Singleton
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import utils.Directories
import java.io.File

@Singleton
class ClaudeSessionRepositoryImpl @Inject constructor(
    private val objectMapper: ObjectMapper,
) : ClaudeSessionRepository {

    private val dataFile = File(Directories.Data, "claude-sessions.json")

    private val lock = Mutex()

    override suspend fun getAll(): List<ClaudeSession> = lock.withLock {
        // Newest first, by start rather than last update, so the cards don't move around on the touch screen.
        loadStore().values.sortedByDescending { it.startedAt }
    }

    override suspend fun update(id: String, fn: (ClaudeSession?) -> ClaudeSession): ClaudeSession = lock.withLock {
        val store = loadStore()
        val session = fn(store[id])
        store[id] = session
        saveStore(store)
        session
    }

    override suspend fun remove(id: String): Boolean = lock.withLock {
        val store = loadStore()
        val removed = store.remove(id) != null
        if (removed) {
            saveStore(store)
        }
        removed
    }

    private suspend fun loadStore(): MutableMap<String, ClaudeSession> = withContext(Dispatchers.IO) {
        if (!dataFile.exists()) {
            return@withContext mutableMapOf()
        }

        objectMapper.readValue<DataWrapper>(dataFile).sessions.associateBy { it.id }.toMutableMap()
    }

    private suspend fun saveStore(store: Map<String, ClaudeSession>) = withContext(Dispatchers.IO) {
        objectMapper.writeValue(dataFile, DataWrapper(store.values.toList()))
    }

    private data class DataWrapper(
        val sessions: List<ClaudeSession>,
    )
}
