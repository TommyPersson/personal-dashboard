package apps.claude.domain

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
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
    val status: ClaudeSessionStatus = ClaudeSessionStatus.Idle,
    /** The tool calls that have started but not finished, oldest first. */
    val runningToolCalls: List<ClaudeToolCall> = emptyList(),
    val turn: ClaudeTurn = ClaudeTurn(),
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
) {
    /** The last part of the worktree's folder. */
    @get:JsonIgnore
    val name: String get() = folderName(path)
}

/** The last part of [path], which may use either kind of slash. */
internal fun folderName(path: String) = path.trimEnd('/', '\\').substringAfterLast('/').substringAfterLast('\\')

data class ClaudeToolCall(
    /** The hook payload's `tool_use_id`. */
    val id: String?,
    val description: String,
)

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes(
    JsonSubTypes.Type(ClaudeSessionStatus.Working::class, name = "Working"),
    JsonSubTypes.Type(ClaudeSessionStatus.WaitingForInput::class, name = "WaitingForInput"),
    JsonSubTypes.Type(ClaudeSessionStatus.Idle::class, name = "Idle"),
)
sealed interface ClaudeSessionStatus {
    /** Claude is working on a prompt. */
    data object Working : ClaudeSessionStatus

    /** Claude is blocked on the user, for [reason]: a permission prompt, a question or a plan to approve. */
    data class WaitingForInput(val reason: String) : ClaudeSessionStatus

    /** Claude has finished its turn. */
    data object Idle : ClaudeSessionStatus
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
