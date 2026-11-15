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

    /** The last part of the session's folder, or of the main checkout's folder for a session in a worktree. */
    val project: String?
        get() = (state.worktree?.repositoryDir ?: state.cwd)?.let(::folderName)

    /**
     * What Claude is doing while it works: the latest tool call still running, else [THINKING]. Tool calls made
     * together run, and so finish, in parallel, so the activity falls back to the calls still running.
     */
    val currentActivity: String?
        get() = if (state.status is ClaudeSessionStatus.Working) {
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

        when (event) {
            is ClaudeHookEvent.UserPromptSubmit -> handleUserPromptSubmit(event, now)
            is ClaudeHookEvent.PreToolUse -> handlePreToolUse(event)
            is ClaudeHookEvent.PostToolUse -> handlePostToolUse(event)
            is ClaudeHookEvent.PostToolUseFailure -> handlePostToolUseFailure(event)
            is ClaudeHookEvent.PermissionRequest -> handlePermissionRequest(event)
            is ClaudeHookEvent.Notification -> handleNotification(event)
            is ClaudeHookEvent.Stop -> handleStop(event, now)
            is ClaudeHookEvent.StopFailure -> handleStopFailure(event, now)
            is ClaudeHookEvent.SessionEnd -> handleSessionEnd(event, now)
            is ClaudeHookEvent.SessionStart, is ClaudeHookEvent.Other -> Unit
        }
    }

    private fun handleUserPromptSubmit(event: ClaudeHookEvent.UserPromptSubmit, now: Instant) {
        if (event.isSystemPrompt) {
            // Claude Code itself submits these, e.g. when a background task finishes: Claude picks the turn up again,
            // so the user's prompt, plan and run time are kept.
            state = state.copy(
                status = ClaudeSessionStatus.Working,
                runningToolCalls = emptyList(),
                turn = state.turn.copy(endedAt = null),
            )

            return
        }

        state = state.copy(
            status = ClaudeSessionStatus.Working,
            runningToolCalls = emptyList(),
            turn = ClaudeTurn.started(event.prompt, now),
        )
    }

    private fun handlePreToolUse(event: ClaudeHookEvent.PreToolUse) {
        val question = ClaudeTools.questionForUser(event.toolName, event.toolInput)
        state = when {
            question != null -> state.copy(
                status = ClaudeSessionStatus.WaitingForInput(question),
            )

            ClaudeTools.isBookkeeping(event.toolName) -> state.copy(
                status = ClaudeSessionStatus.Working,
            )

            else -> state.copy(
                status = ClaudeSessionStatus.Working,
                runningToolCalls = state.runningToolCalls + ClaudeToolCall(
                    event.toolUseId,
                    describeToolCall(event.toolName, event.toolInput)
                )
            )
        }
    }

    private fun handlePostToolUse(event: ClaudeHookEvent.PostToolUse) {
        state = state.copy(
            status = ClaudeSessionStatus.Working,
            runningToolCalls = state.runningToolCalls.finish(event.toolUseId),
            turn = state.turn.withPlanUpdate(event.toolName, event.toolInput),
        )
    }

    /** A failed call doesn't change the plan. */
    private fun handlePostToolUseFailure(event: ClaudeHookEvent.PostToolUseFailure) {
        state = state.copy(
            status = ClaudeSessionStatus.Working,
            runningToolCalls = state.runningToolCalls.finish(event.toolUseId),
        )
    }

    private fun handlePermissionRequest(event: ClaudeHookEvent.PermissionRequest) {
        state = state.copy(
            status = ClaudeSessionStatus.WaitingForInput("Permission: ${describeToolCall(event.toolName, event.toolInput)}"),
        )
    }

    private fun handleNotification(event: ClaudeHookEvent.Notification) {
        // "idle_prompt" is sent a while after a turn has ended; the session is already idle then.
        if (event.notificationType != "idle_prompt") {
            state = state.copy(
                status = ClaudeSessionStatus.WaitingForInput(event.message ?: "Claude needs your attention"),
            )
        }
    }

    private fun handleStop(event: ClaudeHookEvent.Stop, now: Instant) =
        endTurn(event.lastAssistantMessage, failed = false, now)

    /** Like [handleStop], for a turn that ended because of an API error. */
    private fun handleStopFailure(event: ClaudeHookEvent.StopFailure, now: Instant) =
        endTurn(event.lastAssistantMessage, failed = true, now)

    private fun endTurn(lastAssistantMessage: String?, failed: Boolean, now: Instant) {
        // Only a turn seen in progress has finished: not a repeated `Stop` on an idle session, nor one from a session
        // first seen through it (e.g. after a backend restart), which has no prompt or result to show.
        val wasInProgress = state.status !is ClaudeSessionStatus.Idle

        state = state.copy(
            status = ClaudeSessionStatus.Idle,
            runningToolCalls = emptyList(),
            turn = state.turn.ended(now, lastAssistantMessage),
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
    private fun handleSessionEnd(event: ClaudeHookEvent.SessionEnd, now: Instant) {
        if (desktopSessionId == null || event.reason == "clear" || event.reason == "logout") {
            isEnded = true
            return
        }

        state = state.copy(
            status = ClaudeSessionStatus.Idle,
            runningToolCalls = emptyList(),
            turn = state.turn.ended(now),
        )
    }

    companion object {
        /** The activity while Claude works on a prompt with no tool call running. */
        const val THINKING = "Thinking…"

        /**
         * The session that [event] is the first seen of, or `null` if it doesn't start one: a `SessionEnd`, as there
         * is nothing to show for a session whose process ends before it was seen.
         */
        fun startedBy(id: String, event: ClaudeHookEvent, now: Instant): ClaudeSession? {
            if (event is ClaudeHookEvent.SessionEnd) {
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

/** Removes the call [toolUseId], or all of them for a payload without one, which then can't be told apart. */
private fun List<ClaudeToolCall>.finish(toolUseId: String?) =
    if (toolUseId == null) emptyList() else filterNot { it.id == toolUseId }
