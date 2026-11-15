package apps.claude.domain

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.MissingNode

/**
 * A Claude Code hook payload, as the hook received it on stdin.
 * See https://code.claude.com/docs/en/hooks for the fields of each event.
 */
class ClaudeHookEvent(json: JsonNode) {
    val sessionId: String? = json.text("session_id")
    val name: HookEventName = HookEventName.parse(json.text("hook_event_name"))
    /** The session's folder: the project directory the hook script adds, or else the current working directory. */
    val cwd: String? = json.text("project_dir") ?: json.text("cwd")
    /** The Claude desktop app's ID for the session, added by the hook script; anything but a `local_…` ID is ignored. */
    val desktopSessionId: String? = json.text("host_session_id")?.takeIf { DESKTOP_SESSION_ID.matches(it) }
    /**
     * Whether the hook script looked up the session's git worktree, which it only does for some events: then
     * [worktree] is `null` when the session isn't in a linked worktree.
     */
    val hasWorktreeInfo: Boolean = json.has("git_worktree")
    val worktree: ClaudeWorktree? = json["git_worktree"]?.takeIf { it.isObject }?.let { worktree ->
        worktree.text("path")?.let { path ->
            ClaudeWorktree(path = path, branch = worktree.text("branch"), repositoryDir = worktree.text("repository_dir"))
        }
    }
    val toolName: String? = json.text("tool_name")
    val toolInput: JsonNode = json["tool_input"] ?: MissingNode.getInstance()
    val toolUseId: String? = json.text("tool_use_id")
    val prompt: String? = json.text("prompt")
    val message: String? = json.text("message")
    val notificationType: String? = json.text("notification_type")
    /** Claude's final message of the turn, sent with `Stop`. */
    val lastAssistantMessage: String? = json.text("last_assistant_message")
    /** Why the session ended, sent with `SessionEnd`: e.g. `clear`, `logout`, `prompt_input_exit` or `other`. */
    val reason: String? = json.text("reason")

    /**
     * A prompt Claude Code submitted on its own, such as the notification that a background task has finished, or the
     * reminder that the session runs in a git worktree.
     */
    val isSystemPrompt: Boolean
        get() = prompt?.trimStart()?.let { prompt -> SYSTEM_PROMPT_TAGS.any { prompt.startsWith(it) } } == true

    private companion object {
        val SYSTEM_PROMPT_TAGS = listOf("<task-notification>", "<system-reminder>")

        /** What the desktop app accepts in its `claude://code/continue?session=` links. */
        val DESKTOP_SESSION_ID = Regex("^local_[A-Za-z0-9-]{1,64}$")
    }
}

/** The hook events the dashboard reacts to; any other is [Other]. */
enum class HookEventName {
    SessionStart,
    UserPromptSubmit,
    PreToolUse,
    PermissionRequest,
    PostToolUse,
    PostToolUseFailure,
    Notification,
    Stop,
    StopFailure,
    SessionEnd,
    Other;

    companion object {
        fun parse(name: String?): HookEventName = entries.find { it != Other && it.name == name } ?: Other
    }
}
