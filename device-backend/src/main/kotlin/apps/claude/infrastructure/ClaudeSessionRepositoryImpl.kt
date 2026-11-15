package apps.claude.infrastructure

import apps.claude.domain.ClaudeSession
import apps.claude.domain.ClaudeSessionState
import apps.claude.domain.ClaudeSessionRepository
import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import jakarta.inject.Inject
import jakarta.inject.Singleton
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import org.slf4j.LoggerFactory
import utils.Directories
import java.io.File

@Singleton
class ClaudeSessionRepositoryImpl @Inject constructor(
    private val objectMapper: ObjectMapper,
) : ClaudeSessionRepository {

    private val dataFile = File(Directories.Data, "claude-sessions.json")

    private val lock = Mutex()

    private val logger = LoggerFactory.getLogger(ClaudeSessionRepositoryImpl::class.java)

    override suspend fun getAll(): List<ClaudeSession> = lock.withLock {
        loadStore().values.map(::ClaudeSession)
    }

    override suspend fun get(id: String): ClaudeSession? = lock.withLock {
        loadStore()[id]?.let(::ClaudeSession)
    }

    override suspend fun update(id: String, fn: (ClaudeSession?) -> ClaudeSession?): ClaudeSession? = lock.withLock {
        val store = loadStore()
        val existing = store[id]
        val session = fn(existing?.let(::ClaudeSession))

        val changed = when {
            session == null -> false
            session.isEnded -> store.remove(id) != null
            session.state == existing -> false
            else -> {
                store[id] = session.state
                true
            }
        }
        if (changed) {
            saveStore(store)
        }
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

    override suspend fun removeAll(): List<String> = lock.withLock {
        val ids = loadStore().keys.toList()
        if (ids.isNotEmpty()) {
            saveStore(emptyMap())
        }
        ids
    }

    private suspend fun loadStore(): MutableMap<String, ClaudeSessionState> = withContext(Dispatchers.IO) {
        if (!dataFile.exists()) {
            return@withContext mutableMapOf()
        }

        val data = try {
            objectMapper.readValue<DataWrapper>(dataFile)
        } catch (e: JsonProcessingException) {
            // Written by an older version: the sessions are only what's going on right now, so they are dropped rather
            // than migrated. They come back with their next events.
            logger.warn("Discarding unreadable Claude sessions in $dataFile", e)
            DataWrapper(emptyList())
        }

        data.sessions.associateBy { it.id }.toMutableMap()
    }

    private suspend fun saveStore(store: Map<String, ClaudeSessionState>) = withContext(Dispatchers.IO) {
        objectMapper.writeValue(dataFile, DataWrapper(store.values.toList()))
    }

    private data class DataWrapper(
        val sessions: List<ClaudeSessionState>,
    )
}
