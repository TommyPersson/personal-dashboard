package apps.claude.domain

import java.time.Instant

/**
 * The data of a [ClaudeSession], as it is stored. Only the aggregate changes it, as it handles the session's hook
 * events.
 */
data class ClaudeSessionState(
    val id: String,
    val cwd: String?,
    /** The Claude desktop app's ID for the session; `null` for sessions it doesn't run, such as the CLI's. */
    val desktopSessionId: String? = null,
    /** The linked git worktree the session works in; `null` for a main checkout, or when it isn't known yet. */
    val worktree: ClaudeWorktree? = null,
    /** The latest prompt submitted in the session. */
    val prompt: String? = null,
    val status: ClaudeSessionStatus = ClaudeSessionStatus.Idle,
    /** What the session is waiting for while [status] is [ClaudeSessionStatus.WaitingForInput]. */
    val waitingFor: String? = null,
    /** The tool calls that have started but not finished, oldest first. */
    val runningToolCalls: List<ClaudeToolCall> = emptyList(),
    /** The task list of the current prompt. */
    val plan: List<ClaudePlanItem> = emptyList(),
    /** When the latest prompt was submitted. */
    val promptStartedAt: Instant? = null,
    /** When Claude finished its turn on the latest prompt; `null` while it is still on it. */
    val promptEndedAt: Instant? = null,
    /** A shortened, plain-text version of Claude's last message on the latest prompt, once its turn has ended. */
    val result: String? = null,
    val startedAt: Instant,
    val updatedAt: Instant,
)

data class ClaudeWorktree(
    /** The worktree's root folder. */
    val path: String,
    /** The branch checked out in it; `null` when its HEAD is detached. */
    val branch: String?,
    /** The main checkout's folder; `null` for a bare repository. */
    val repositoryDir: String?,
)

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
