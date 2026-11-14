package apps.claude.domain

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.MissingNode
import java.time.Instant

/**
 * A Claude Code hook payload, as the hook received it on stdin.
 * See https://code.claude.com/docs/en/hooks for the fields of each event.
 */
class ClaudeHookEvent(private val json: JsonNode) {
    val sessionId: String? get() = json.text("session_id")
    val hookEventName: String? get() = json.text("hook_event_name")
    /** The session's folder: the project directory the hook script adds, or else the current working directory. */
    val cwd: String? get() = json.text("project_dir") ?: json.text("cwd")
    val toolName: String? get() = json.text("tool_name")
    val toolInput: JsonNode get() = json["tool_input"] ?: MissingNode.getInstance()
    val prompt: String? get() = json.text("prompt")
    val message: String? get() = json.text("message")
    val notificationType: String? get() = json.text("notification_type")

    val isSessionEnd: Boolean get() = hookEventName == "SessionEnd"
}

/** Folds [event] into the session's state. */
fun ClaudeSession.apply(event: ClaudeHookEvent, now: Instant): ClaudeSession {
    val session = copy(cwd = event.cwd ?: cwd, updatedAt = now)

    return when (event.hookEventName) {
        "UserPromptSubmit" -> session.copy(
            prompt = event.prompt,
            status = ClaudeSessionStatus.Working,
            waitingFor = null,
            currentActivity = null,
            plan = emptyList(),
            promptStartedAt = now,
            promptEndedAt = null,
        )

        "PreToolUse" -> when (val question = event.questionForUser()) {
            null -> session.copy(
                status = ClaudeSessionStatus.Working,
                waitingFor = null,
                currentActivity = event.describeToolCall(),
            )

            else -> session.copy(
                status = ClaudeSessionStatus.WaitingForInput,
                waitingFor = question,
                currentActivity = null,
            )
        }

        "PermissionRequest" -> session.copy(
            status = ClaudeSessionStatus.WaitingForInput,
            waitingFor = "Permission: ${event.describeToolCall()}",
        )

        "PostToolUse" -> session.copy(
            status = ClaudeSessionStatus.Working,
            waitingFor = null,
            currentActivity = null,
            plan = applyPlanUpdate(plan, event),
        )

        "PostToolUseFailure" -> session.copy(
            status = ClaudeSessionStatus.Working,
            waitingFor = null,
            currentActivity = null,
        )

        // "idle_prompt" is sent a while after a turn has ended; the session is already idle then.
        "Notification" -> if (event.notificationType == "idle_prompt") session else session.copy(
            status = ClaudeSessionStatus.WaitingForInput,
            waitingFor = event.message ?: "Claude needs your attention",
        )

        "Stop", "StopFailure" -> session.copy(
            status = ClaudeSessionStatus.Idle,
            waitingFor = null,
            currentActivity = null,
            promptEndedAt = promptStartedAt?.let { now },
        )

        else -> session
    }
}

/** Tools that block on the user until they answer. */
private fun ClaudeHookEvent.questionForUser(): String? = when (toolName) {
    "AskUserQuestion" -> toolInput["questions"]?.firstOrNull()?.text("question") ?: "Claude has a question"
    "ExitPlanMode" -> "Plan approval"
    else -> null
}

private fun ClaudeHookEvent.describeToolCall(): String {
    toolInput.text("description")?.let { return it }

    val tool = toolName?.substringAfterLast("__") ?: "tool"
    val target = toolInput.text("file_path")?.substringAfterLast('/')?.substringAfterLast('\\')
        ?: toolInput.text("pattern")
        ?: toolInput.text("url")

    return if (target != null) "$tool $target" else tool
}

private fun applyPlanUpdate(plan: List<ClaudePlanItem>, event: ClaudeHookEvent): List<ClaudePlanItem> {
    val input = event.toolInput

    return when (event.toolName) {
        // The Claude desktop app's task list. Only the first call of a turn has the whole list; later calls
        // advance it or mark steps (1-based) as done or started.
        "mcp__ccd_turn__update_plan" -> {
            var items = input["items"]?.let(::parsePlanItems) ?: plan

            if (input["advance"]?.asBoolean() == true) {
                items = advance(items)
            }
            input["done"]?.forEach { index ->
                items = items.withStatus(index.asInt() - 1, ClaudePlanItemStatus.Completed)
            }
            input["start"]?.takeIf { it.isInt }?.let { index ->
                items = items.withStatus(index.asInt() - 1, ClaudePlanItemStatus.InProgress)
            }

            items
        }

        // Ends the desktop app's turn, which checks off the task list.
        "mcp__ccd_turn__wrap_up" -> plan.map { it.copy(status = ClaudePlanItemStatus.Completed) }

        // The Claude Code CLI's task list. Every call has the whole list.
        "TodoWrite" -> input["todos"]?.let(::parsePlanItems) ?: plan

        else -> plan
    }
}

private fun parsePlanItems(items: JsonNode): List<ClaudePlanItem> = items.mapNotNull { item ->
    val content = item.text("content") ?: return@mapNotNull null
    ClaudePlanItem(content = content, status = parsePlanItemStatus(item.text("status")))
}

private fun parsePlanItemStatus(status: String?) = when (status) {
    "in_progress" -> ClaudePlanItemStatus.InProgress
    "completed" -> ClaudePlanItemStatus.Completed
    else -> ClaudePlanItemStatus.Pending
}

/** Completes the step in progress and starts the next pending one. */
private fun advance(items: List<ClaudePlanItem>): List<ClaudePlanItem> {
    val current = items.indexOfFirst { it.status == ClaudePlanItemStatus.InProgress }
    val completed = items.withStatus(current, ClaudePlanItemStatus.Completed)

    val next = completed.withIndex()
        .firstOrNull { (index, item) -> index > current && item.status == ClaudePlanItemStatus.Pending }
        ?.index
        ?: return completed

    return completed.withStatus(next, ClaudePlanItemStatus.InProgress)
}

private fun List<ClaudePlanItem>.withStatus(index: Int, status: ClaudePlanItemStatus) =
    mapIndexed { i, item -> if (i == index) item.copy(status = status) else item }

private fun JsonNode.text(field: String): String? = get(field)?.takeIf { it.isTextual }?.asText()
