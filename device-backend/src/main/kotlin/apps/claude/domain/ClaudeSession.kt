package apps.claude.domain

import java.time.Instant

/** What a Claude Code session on the workstation is doing, as reconstructed from its hook events. */
data class ClaudeSession(
    val id: String,
    val cwd: String?,
    /** The Claude desktop app's ID for the session; `null` for sessions it doesn't run, such as the CLI's. */
    val desktopSessionId: String? = null,
    /** The latest prompt submitted in the session. */
    val prompt: String?,
    val status: ClaudeSessionStatus,
    /** What the session is waiting for while [status] is [ClaudeSessionStatus.WaitingForInput]. */
    val waitingFor: String?,
    /** What Claude is doing: the latest tool call still running, else [THINKING] while it works on a prompt. */
    val currentActivity: String?,
    /** The tool calls that have started but not finished, oldest first. */
    val runningToolCalls: List<ClaudeToolCall> = emptyList(),
    /** The task list of the current prompt. */
    val plan: List<ClaudePlanItem>,
    /** When the latest prompt was submitted. */
    val promptStartedAt: Instant? = null,
    /** When Claude finished its turn on the latest prompt; `null` while it is still on it. */
    val promptEndedAt: Instant? = null,
    /** A shortened, plain-text version of Claude's last message on the latest prompt, once its turn has ended. */
    val result: String? = null,
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

data class ClaudeToolCall(
    /** The hook payload's `tool_use_id`. */
    val id: String?,
    val description: String,
)

/** The activity while Claude works on a prompt with no tool call running. */
const val THINKING = "Thinking…"

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
