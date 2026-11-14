package apps.claude.domain

interface ClaudeSessionRepository {
    suspend fun getAll(): List<ClaudeSession>

    /** Replaces the session with what [fn] returns (given `null` if there is none), atomically. */
    suspend fun update(id: String, fn: (ClaudeSession?) -> ClaudeSession): ClaudeSession

    /** Returns whether there was a session to remove. */
    suspend fun remove(id: String): Boolean
}
