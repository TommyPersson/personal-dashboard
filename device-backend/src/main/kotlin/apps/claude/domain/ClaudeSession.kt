package apps.claude.domain

import java.time.Instant

/**
 * What a Claude Code session on the workstation is doing, as reconstructed from its hook events: each one is given to
 * [handle], which updates the session's [state].
 */
class ClaudeSession internal constructor(state: ClaudeSessionState) {

    var state: ClaudeSessionState = state
        private set

    val id: String get() = state.id

    val desktopSessionId: String? get() = state.desktopSessionId

    /**
     * Whether the session's conversation is gone, not just its Claude Code process: the session is to be forgotten.
     */
    var isEnded: Boolean = false
        private set

    /** What happened to the session in the events handled since it was loaded, oldest first. */
    val pendingEvents: List<ClaudeSessionEvent>
        field = mutableListOf<ClaudeSessionEvent>()

    /**
     * What Claude is doing while it works: the latest tool call still running, else [THINKING]. Tool calls made
     * together run, and so finish, in parallel, so the activity falls back to the calls still running.
     */
    val currentActivity: String?
        get() = if (state.status == ClaudeSessionStatus.Working) {
            state.runningToolCalls.lastOrNull()?.description ?: THINKING
        } else {
            null
        }

    fun handle(event: ClaudeHookEvent, now: Instant) {
        check(!isEnded) { "Session $id has ended" }

        state = state.copy(
            cwd = event.cwd ?: state.cwd,
            desktopSessionId = event.desktopSessionId ?: state.desktopSessionId,
            worktree = if (event.hasWorktreeInfo) event.worktree else state.worktree,
            updatedAt = now
        )

        when (event.name) {
            HookEventName.UserPromptSubmit -> handlePromptSubmitted(event, now)
            HookEventName.PreToolUse -> handleToolCallStarting(event, now)
            HookEventName.PostToolUse -> handleToolCallFinished(event, now, succeeded = true)
            HookEventName.PostToolUseFailure -> handleToolCallFinished(event, now, succeeded = false)
            HookEventName.PermissionRequest -> handlePermissionRequest(event, now)
            HookEventName.Notification -> handleNotification(event, now)
            HookEventName.Stop -> handleTurnEnded(event, now, failed = false)
            HookEventName.StopFailure -> handleTurnEnded(event, now, failed = true)
            HookEventName.SessionEnd -> handleSessionEnded(event, now)
            HookEventName.SessionStart, HookEventName.Other -> Unit
        }
    }

    private fun handlePromptSubmitted(event: ClaudeHookEvent, now: Instant) {
        if (event.isSystemPrompt) {
            // Claude Code itself submits these, e.g. when a background task finishes: Claude picks the turn up again,
            // so the user's prompt, plan and run time are kept.
            state = state.copy(
                status = ClaudeSessionStatus.Working,
                waitingFor = null,
                updatedAt = now,
                runningToolCalls = emptyList(),
                promptEndedAt = null
            )

            return
        }

        state = state.copy(
            status = ClaudeSessionStatus.Working,
            waitingFor = null,
            updatedAt = now,
            prompt = event.prompt,
            runningToolCalls = emptyList(),
            plan = emptyList(),
            promptStartedAt = now,
            promptEndedAt = null,
            result = null,
        )
    }

    private fun handleToolCallStarting(event: ClaudeHookEvent, now: Instant) {
        val question = ClaudeTools.questionForUser(event.toolName, event.toolInput)
        state = when {
            question != null -> state.copy(
                status = ClaudeSessionStatus.WaitingForInput,
                waitingFor = question,
                updatedAt = now
            )

            ClaudeTools.isBookkeeping(event.toolName) -> state.copy(
                status = ClaudeSessionStatus.Working,
                waitingFor = null,
                updatedAt = now
            )

            else -> state.copy(
                status = ClaudeSessionStatus.Working,
                waitingFor = null,
                updatedAt = now,
                runningToolCalls = state.runningToolCalls + ClaudeToolCall(
                    event.toolUseId,
                    event.describeToolCall()
                )
            )
        }
    }

    private fun handleToolCallFinished(event: ClaudeHookEvent, now: Instant, succeeded: Boolean) {
        state = state.copy(
            status = ClaudeSessionStatus.Working,
            waitingFor = null,
            updatedAt = now,
            runningToolCalls = state.runningToolCalls.finish(event),
            plan = if (succeeded) applyPlanUpdate(state.plan, event.toolName, event.toolInput) else state.plan,
        )
    }

    private fun handlePermissionRequest(event: ClaudeHookEvent, now: Instant) {
        state = state.copy(
            status = ClaudeSessionStatus.WaitingForInput,
            waitingFor = "Permission: ${event.describeToolCall()}",
            updatedAt = now
        )
    }

    private fun handleNotification(event: ClaudeHookEvent, now: Instant) {
        // "idle_prompt" is sent a while after a turn has ended; the session is already idle then.
        if (event.notificationType != "idle_prompt") {
            state = state.copy(
                status = ClaudeSessionStatus.WaitingForInput,
                waitingFor = event.message ?: "Claude needs your attention",
                updatedAt = now
            )
        }
    }

    private fun handleTurnEnded(event: ClaudeHookEvent, now: Instant, failed: Boolean) {
        // Only a turn seen in progress has finished: not a repeated `Stop` on an idle session, nor one from a session
        // first seen through it (e.g. after a backend restart), which has no prompt or result to show.
        val wasInProgress = state.status != ClaudeSessionStatus.Idle

        state = state.copy(
            status = ClaudeSessionStatus.Idle,
            promptEndedAt = state.promptStartedAt?.let { now },
            result = event.lastAssistantMessage?.let(::summarizeMessage) ?: state.result,
            waitingFor = null,
            runningToolCalls = emptyList(),
            updatedAt = now
        )

        if (wasInProgress) {
            pendingEvents += ClaudeSessionEvent.TurnEnded(failed)
        }
    }

    /**
     * A `SessionEnd` means the conversation is gone, not just its Claude Code process: always for CLI sessions, but
     * the desktop app stops the processes of sessions it keeps (reason `other`), so only `/clear` and logging out end
     * one of those. Then nothing can still be running.
     */
    private fun handleSessionEnded(event: ClaudeHookEvent, now: Instant) {
        if (desktopSessionId == null || event.reason == "clear" || event.reason == "logout") {
            isEnded = true
            return
        }

        state = state.copy(
            status = ClaudeSessionStatus.Idle,
            promptEndedAt = state.promptEndedAt ?: state.promptStartedAt?.let { now },
            waitingFor = null,
            runningToolCalls = emptyList(),
            updatedAt = now
        )
    }

    companion object {
        /**
         * The session that [event] is the first seen of, or `null` if it doesn't start one: a `SessionEnd`, as there
         * is nothing to show for a session whose process ends before it was seen.
         */
        fun startedBy(id: String, event: ClaudeHookEvent, now: Instant): ClaudeSession? {
            if (event.name == HookEventName.SessionEnd) {
                return null
            }
            return ClaudeSession(ClaudeSessionState(id = id, cwd = event.cwd, startedAt = now, updatedAt = now))
        }
    }
}

/** Something that happened to a [ClaudeSession] that others may react to. */
sealed interface ClaudeSessionEvent {
    /** Claude finished a turn that was seen in progress, [failed] because of an API error or not. */
    data class TurnEnded(val failed: Boolean) : ClaudeSessionEvent
}

/** Removes [event]'s call, or all of them for a payload without `tool_use_id`, which then can't be told apart. */
private fun List<ClaudeToolCall>.finish(event: ClaudeHookEvent) =
    if (event.toolUseId == null) emptyList() else filterNot { it.id == event.toolUseId }

private fun ClaudeHookEvent.describeToolCall(): String = describeToolCall(toolName, toolInput)
