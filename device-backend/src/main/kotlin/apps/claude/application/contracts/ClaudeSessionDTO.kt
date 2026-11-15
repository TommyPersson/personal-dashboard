package apps.claude.application.contracts

import apps.claude.domain.ClaudePlanItem
import apps.claude.domain.ClaudeSession
import java.time.Instant

data class GetClaudeSessionsResponseDTO(
    val sessions: List<ClaudeSessionDTO>,
)

data class ClaudeSessionDTO(
    val id: String,
    /** The last part of the session's working directory. */
    val project: String?,
    val cwd: String?,
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

data class ClaudePlanItemDTO(
    val content: String,
    val status: String,
)

fun ClaudeSession.toDTO() = ClaudeSessionDTO(
    id = id,
    project = cwd?.trimEnd('/', '\\')?.substringAfterLast('/')?.substringAfterLast('\\'),
    cwd = cwd,
    canOpenOnWorkstation = desktopSessionId != null,
    prompt = prompt,
    status = status.name,
    waitingFor = waitingFor,
    currentActivity = currentActivity,
    plan = plan.map { it.toDTO() },
    promptStartedAt = promptStartedAt,
    promptEndedAt = promptEndedAt,
    result = result,
    startedAt = startedAt,
    updatedAt = updatedAt,
)

fun ClaudePlanItem.toDTO() = ClaudePlanItemDTO(
    content = content,
    status = status.name,
)
