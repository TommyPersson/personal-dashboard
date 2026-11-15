package apps.claude.domain

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.MissingNode

/**
 * A Claude Code hook payload, as the hook received it on stdin, deserialized by Jackson into the subclass named by its
 * `hook_event_name`; events the dashboard doesn't react to become [Other].
 * See https://code.claude.com/docs/en/hooks for the fields of each event.
 *
 * Jackson sets the raw fields every event has after the subclass is constructed; the public properties derived from
 * them are computed on first use, by which time deserialization is done.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "hook_event_name",
    defaultImpl = ClaudeHookEvent.Other::class,
)
@JsonSubTypes(
    JsonSubTypes.Type(ClaudeHookEvent.SessionStart::class, name = "SessionStart"),
    JsonSubTypes.Type(ClaudeHookEvent.UserPromptSubmit::class, name = "UserPromptSubmit"),
    JsonSubTypes.Type(ClaudeHookEvent.PreToolUse::class, name = "PreToolUse"),
    JsonSubTypes.Type(ClaudeHookEvent.PermissionRequest::class, name = "PermissionRequest"),
    JsonSubTypes.Type(ClaudeHookEvent.PostToolUse::class, name = "PostToolUse"),
    JsonSubTypes.Type(ClaudeHookEvent.PostToolUseFailure::class, name = "PostToolUseFailure"),
    JsonSubTypes.Type(ClaudeHookEvent.Notification::class, name = "Notification"),
    JsonSubTypes.Type(ClaudeHookEvent.Stop::class, name = "Stop"),
    JsonSubTypes.Type(ClaudeHookEvent.StopFailure::class, name = "StopFailure"),
    JsonSubTypes.Type(ClaudeHookEvent.SessionEnd::class, name = "SessionEnd"),
)
sealed class ClaudeHookEvent {

    @field:JsonProperty("session_id")
    private var rawSessionId: String? = null

    @field:JsonProperty("project_dir")
    private var rawProjectDir: String? = null

    @field:JsonProperty("cwd")
    private var rawCwd: String? = null

    @field:JsonProperty("host_session_id")
    private var rawHostSessionId: String? = null

    /** `null` when absent, a `NullNode` when the payload has `"git_worktree": null`. */
    @field:JsonProperty("git_worktree")
    private var rawGitWorktree: JsonNode? = null

    @get:JsonIgnore
    val sessionId: String? get() = rawSessionId

    /** The session's folder: the project directory the hook script adds, or else the current working directory. */
    @get:JsonIgnore
    val cwd: String? get() = rawProjectDir ?: rawCwd

    /** The Claude desktop app's ID for the session, added by the hook script; anything but a `local_…` ID is ignored. */
    @get:JsonIgnore
    val desktopSessionId: String? by lazy { rawHostSessionId?.takeIf { DESKTOP_SESSION_ID.matches(it) } }

    /**
     * Whether the hook script looked up the session's git worktree, which it only does for some events: then
     * [worktree] is `null` when the session isn't in a linked worktree.
     */
    @get:JsonIgnore
    val hasWorktreeInfo: Boolean get() = rawGitWorktree != null

    @get:JsonIgnore
    val worktree: ClaudeWorktree? by lazy {
        rawGitWorktree?.takeIf { it.isObject }?.let { worktree ->
            worktree.text("path")?.let { path ->
                ClaudeWorktree(path = path, branch = worktree.text("branch"), repositoryDir = worktree.text("repository_dir"))
            }
        }
    }

    class SessionStart : ClaudeHookEvent()

    class UserPromptSubmit(
        val prompt: String? = null,
    ) : ClaudeHookEvent() {
        /**
         * A prompt Claude Code submitted on its own, such as the notification that a background task has finished, or
         * the reminder that the session runs in a git worktree.
         */
        @get:JsonIgnore
        val isSystemPrompt: Boolean
            get() = prompt?.trimStart()?.let { prompt -> SYSTEM_PROMPT_TAGS.any { prompt.startsWith(it) } } == true
    }

    class PreToolUse(
        @JsonProperty("tool_name") val toolName: String? = null,
        @JsonProperty("tool_input") val toolInput: JsonNode = MissingNode.getInstance(),
        @JsonProperty("tool_use_id") val toolUseId: String? = null,
    ) : ClaudeHookEvent()

    class PermissionRequest(
        @JsonProperty("tool_name") val toolName: String? = null,
        @JsonProperty("tool_input") val toolInput: JsonNode = MissingNode.getInstance(),
        @JsonProperty("tool_use_id") val toolUseId: String? = null,
    ) : ClaudeHookEvent()

    class PostToolUse(
        @JsonProperty("tool_name") val toolName: String? = null,
        @JsonProperty("tool_input") val toolInput: JsonNode = MissingNode.getInstance(),
        @JsonProperty("tool_use_id") val toolUseId: String? = null,
    ) : ClaudeHookEvent()

    class PostToolUseFailure(
        @JsonProperty("tool_name") val toolName: String? = null,
        @JsonProperty("tool_input") val toolInput: JsonNode = MissingNode.getInstance(),
        @JsonProperty("tool_use_id") val toolUseId: String? = null,
    ) : ClaudeHookEvent()

    class Notification(
        val message: String? = null,
        @JsonProperty("notification_type") val notificationType: String? = null,
    ) : ClaudeHookEvent()

    /** Claude finished its turn. */
    class Stop(
        /** Claude's final message of the turn. */
        @JsonProperty("last_assistant_message") val lastAssistantMessage: String? = null,
    ) : ClaudeHookEvent()

    /** Claude's turn ended because of an API error. */
    class StopFailure(
        @JsonProperty("last_assistant_message") val lastAssistantMessage: String? = null,
    ) : ClaudeHookEvent()

    class SessionEnd(
        /** Why the session ended: e.g. `clear`, `logout`, `prompt_input_exit` or `other`. */
        val reason: String? = null,
    ) : ClaudeHookEvent()

    /** A hook event the dashboard doesn't react to, or a payload without `hook_event_name`. */
    class Other : ClaudeHookEvent()

    private companion object {
        val SYSTEM_PROMPT_TAGS = listOf("<task-notification>", "<system-reminder>")

        /** What the desktop app accepts in its `claude://code/continue?session=` links. */
        val DESKTOP_SESSION_ID = Regex("^local_[A-Za-z0-9-]{1,64}$")
    }
}
