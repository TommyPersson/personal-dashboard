package apps.claude.domain

import com.fasterxml.jackson.databind.JsonNode

/** The tools whose calls change the session beyond being shown as an activity. */
internal object ClaudeTools {
    /** The Claude desktop app's task list. */
    const val UPDATE_PLAN = "mcp__ccd_turn__update_plan"

    /** Ends the desktop app's turn, which checks off its task list. */
    const val WRAP_UP = "mcp__ccd_turn__wrap_up"

    /** The Claude Code CLI's task list. */
    const val TODO_WRITE = "TodoWrite"

    const val TOOL_SEARCH = "ToolSearch"
    const val ASK_USER_QUESTION = "AskUserQuestion"
    const val EXIT_PLAN_MODE = "ExitPlanMode"

    /** Tools that keep track of the turn rather than do its work, so they don't replace the current activity. */
    private val bookkeeping = setOf(UPDATE_PLAN, WRAP_UP, TODO_WRITE, TOOL_SEARCH)

    fun isBookkeeping(toolName: String?): Boolean = toolName in bookkeeping

    /** What a call blocks on the user for until they answer, or `null` for a tool that doesn't. */
    fun questionForUser(toolName: String?, input: JsonNode): String? = when (toolName) {
        ASK_USER_QUESTION -> input["questions"]?.firstOrNull()?.text("question") ?: "Claude has a question"
        EXIT_PLAN_MODE -> "Plan approval"
        else -> null
    }
}
