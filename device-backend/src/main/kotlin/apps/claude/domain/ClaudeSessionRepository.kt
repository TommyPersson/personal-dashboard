package apps.claude.domain

interface ClaudeSessionRepository {
    suspend fun getAll(): List<ClaudeSession>

    suspend fun get(id: String): ClaudeSession?

    /**
     * Atomically gives [fn] the session (`null` if there is none) and stores what it returns, which may be the same
     * session after it has handled events. Nothing is stored when it returns `null`, and an
     * [ended][ClaudeSession.isEnded] session is removed.
     */
    suspend fun update(id: String, fn: (ClaudeSession?) -> ClaudeSession?): ClaudeSession?

    /** Returns whether there was a session to remove. */
    suspend fun remove(id: String): Boolean

    /** Returns the IDs of the removed sessions. */
    suspend fun removeAll(): List<String>
}
