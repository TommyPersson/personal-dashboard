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
    val toolUseId: String? get() = json.text("tool_use_id")
    val prompt: String? get() = json.text("prompt")
    val message: String? get() = json.text("message")
    val notificationType: String? get() = json.text("notification_type")
    /** Claude's final message of the turn, sent with `Stop`. */
    val lastAssistantMessage: String? get() = json.text("last_assistant_message")

    val isSessionEnd: Boolean get() = hookEventName == "SessionEnd"

    /** A prompt Claude Code submitted on its own, such as the notification that a background task has finished. */
    val isSystemPrompt: Boolean get() = prompt?.trimStart()?.startsWith("<task-notification>") == true
}

/** Folds [event] into the session's state. */
fun ClaudeSession.apply(event: ClaudeHookEvent, now: Instant): ClaudeSession {
    val session = copy(cwd = event.cwd ?: cwd, updatedAt = now)

    return when (event.hookEventName) {
        // Claude Code itself submits these, e.g. when a background task finishes: Claude picks the turn up again,
        // so the user's prompt, plan and run time are kept.
        "UserPromptSubmit" if event.isSystemPrompt -> session.copy(
            status = ClaudeSessionStatus.Working,
            waitingFor = null,
            currentActivity = THINKING,
            runningToolCalls = emptyList(),
            promptEndedAt = null,
        )

        "UserPromptSubmit" -> session.copy(
            prompt = event.prompt,
            status = ClaudeSessionStatus.Working,
            waitingFor = null,
            currentActivity = THINKING,
            runningToolCalls = emptyList(),
            plan = emptyList(),
            promptStartedAt = now,
            promptEndedAt = null,
            result = null,
        )

        "PreToolUse" -> when (val question = event.questionForUser()) {
            null -> if (event.isBookkeeping) session.copy(status = ClaudeSessionStatus.Working, waitingFor = null)
            else session.copy(
                status = ClaudeSessionStatus.Working,
                waitingFor = null,
                runningToolCalls = runningToolCalls + ClaudeToolCall(event.toolUseId, event.describeToolCall()),
            ).withCurrentActivity()

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

        // Tool calls made together run, and so finish, in parallel: the activity falls back to the calls still
        // running, and to Claude thinking once none are.
        "PostToolUse" -> session.copy(
            status = ClaudeSessionStatus.Working,
            waitingFor = null,
            runningToolCalls = runningToolCalls.finish(event),
            plan = applyPlanUpdate(plan, event),
        ).withCurrentActivity()

        "PostToolUseFailure" -> session.copy(
            status = ClaudeSessionStatus.Working,
            waitingFor = null,
            runningToolCalls = runningToolCalls.finish(event),
        ).withCurrentActivity()

        // "idle_prompt" is sent a while after a turn has ended; the session is already idle then.
        "Notification" -> if (event.notificationType == "idle_prompt") session else session.copy(
            status = ClaudeSessionStatus.WaitingForInput,
            waitingFor = event.message ?: "Claude needs your attention",
        )

        "Stop", "StopFailure" -> session.copy(
            status = ClaudeSessionStatus.Idle,
            waitingFor = null,
            currentActivity = null,
            runningToolCalls = emptyList(),
            promptEndedAt = promptStartedAt?.let { now },
            result = event.lastAssistantMessage?.let(::summarizeMessage) ?: result,
        )

        else -> session
    }
}

private fun ClaudeSession.withCurrentActivity() =
    copy(currentActivity = runningToolCalls.lastOrNull()?.description ?: THINKING)

/** Removes [event]'s call, or all of them for a payload without `tool_use_id`, which then can't be told apart. */
private fun List<ClaudeToolCall>.finish(event: ClaudeHookEvent) =
    if (event.toolUseId == null) emptyList() else filterNot { it.id == event.toolUseId }

/** Tools that keep track of the turn rather than do its work, so they don't replace the current activity. */
private val bookkeepingTools = setOf("mcp__ccd_turn__update_plan", "mcp__ccd_turn__wrap_up", "TodoWrite", "ToolSearch")

private val ClaudeHookEvent.isBookkeeping: Boolean get() = toolName in bookkeepingTools

/** Tools that block on the user until they answer. */
private fun ClaudeHookEvent.questionForUser(): String? = when (toolName) {
    "AskUserQuestion" -> toolInput["questions"]?.firstOrNull()?.text("question") ?: "Claude has a question"
    "ExitPlanMode" -> "Plan approval"
    else -> null
}

private fun ClaudeHookEvent.describeToolCall(): String = describeToolCall(toolName, toolInput)

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

private const val MAX_RESULT_LENGTH = 300

/**
 * Turns Claude's Markdown reply into a short plain-text summary for a card: code blocks, tables and Markdown markers
 * are dropped, blank lines collapsed, and the text cut at a word boundary after [MAX_RESULT_LENGTH] characters.
 */
internal fun summarizeMessage(message: String): String? {
    val text = message
        .replace(Regex("```.*?(```|$)", RegexOption.DOT_MATCHES_ALL), "")
        .lines()
        .filterNot { it.trimStart().startsWith("|") }
        .joinToString("\n") { line ->
            line
                .replace(Regex("^\\s*#{1,6}\\s+"), "")
                .replace(Regex("^(\\s*)[-*+]\\s+"), "$1• ")
                .replace(Regex("\\[([^\\]]+)\\]\\([^)]*\\)"), "$1")
                .replace(Regex("\\*\\*|__|`"), "")
                .trimEnd()
        }
        .replace(Regex("\n{2,}"), "\n")
        .trim()

    if (text.isEmpty()) {
        return null
    }
    if (text.length <= MAX_RESULT_LENGTH) {
        return text
    }

    val cut = text.substring(0, MAX_RESULT_LENGTH)
    return cut.substring(0, cut.lastIndexOf(' ').takeIf { it > MAX_RESULT_LENGTH / 2 } ?: cut.length).trimEnd() + "…"
}

private fun JsonNode.text(field: String): String? = get(field)?.takeIf { it.isTextual }?.asText()
