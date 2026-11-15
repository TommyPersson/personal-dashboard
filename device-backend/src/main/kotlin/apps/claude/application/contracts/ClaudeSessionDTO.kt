package apps.claude.application.contracts

import apps.claude.domain.ClaudePlanItem
import apps.claude.domain.ClaudeSession
import apps.claude.domain.ClaudeWorktree
import java.time.Instant

data class GetClaudeSessionsResponseDTO(
    val sessions: List<ClaudeSessionDTO>,
)

data class ClaudeSessionDTO(
    val id: String,
    /** The last part of the session's folder, or of the main checkout's folder for a session in a worktree. */
    val project: String?,
    val cwd: String?,
    /** The linked git worktree the session works in, if any. */
    val worktree: ClaudeWorktreeDTO?,
    /** Whether the session can be opened in the Claude desktop app on the workstation. */
    val canOpenOnWorkstation: Boolean,
    val prompt: String?,
    val status: String,
    val waitingFor: String?,
    val currentActivity: String?,
    val plan: List<ClaudePlanItemDTO>,
    val promptStartedAt: Instant?,
    val promptEndedAt: Instant?,
    /** A shortened, plain-text version of Claude's last message on the latest prompt. */
    val result: String?,
    val startedAt: Instant,
    val updatedAt: Instant,
)

data class ClaudeWorktreeDTO(
    /** The last part of the worktree's folder. */
    val name: String,
    val path: String,
    val branch: String?,
)

data class ClaudePlanItemDTO(
    val content: String,
    val status: String,
)

fun ClaudeSession.toDTO() = with(state) {
    ClaudeSessionDTO(
        id = id,
        project = (worktree?.repositoryDir ?: cwd)?.let(::folderName),
        cwd = cwd,
        worktree = worktree?.toDTO(),
        canOpenOnWorkstation = desktopSessionId != null,
        prompt = prompt,
        status = status.name,
        waitingFor = waitingFor,
        currentActivity = this@toDTO.currentActivity,
        plan = plan.map { it.toDTO() },
        promptStartedAt = promptStartedAt,
        promptEndedAt = promptEndedAt,
        result = result,
        startedAt = startedAt,
        updatedAt = updatedAt,
    )
}

fun ClaudeWorktree.toDTO() = ClaudeWorktreeDTO(
    name = folderName(path),
    path = path,
    branch = branch,
)

private fun folderName(path: String) = path.trimEnd('/', '\\').substringAfterLast('/').substringAfterLast('\\')

fun ClaudePlanItem.toDTO() = ClaudePlanItemDTO(
    content = content,
    status = status.name,
)
