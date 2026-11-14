package apps.claude.domain

import java.time.Instant

/** What a Claude Code session on the workstation is doing, as reconstructed from its hook events. */
data class ClaudeSession(
    val id: String,
    val cwd: String?,
    /** The latest prompt submitted in the session. */
    val prompt: String?,
    val status: ClaudeSessionStatus,
    /** What the session is waiting for while [status] is [ClaudeSessionStatus.WaitingForInput]. */
    val waitingFor: String?,
    /** The tool call currently running, if any. */
    val currentActivity: String?,
    /** The task list of the current prompt. */
    val plan: List<ClaudePlanItem>,
    /** When the latest prompt was submitted. */
    val promptStartedAt: Instant? = null,
    /** When Claude finished its turn on the latest prompt; `null` while it is still on it. */
    val promptEndedAt: Instant? = null,
    val startedAt: Instant,
    val updatedAt: Instant,
) {
    companion object {
        fun new(id: String, cwd: String?, now: Instant) = ClaudeSession(
            id = id,
            cwd = cwd,
            prompt = null,
            status = ClaudeSessionStatus.Idle,
            waitingFor = null,
            currentActivity = null,
            plan = emptyList(),
            promptStartedAt = null,
            promptEndedAt = null,
            startedAt = now,
            updatedAt = now,
        )
    }
}

enum class ClaudeSessionStatus {
    /** Claude is working on a prompt. */
    Working,

    /** Claude is blocked on the user: a permission prompt, a question or a plan to approve. */
    WaitingForInput,

    /** Claude has finished its turn. */
    Idle,
}

data class ClaudePlanItem(
    val content: String,
    val status: ClaudePlanItemStatus,
)

enum class ClaudePlanItemStatus {
    Pending,
    InProgress,
    Completed,
}
