package apps.claude.domain

import com.fasterxml.jackson.databind.JsonNode
import java.time.Instant

/**
 * Claude's work on the latest prompt, from its submission until Claude stops. A turn first seen in progress, e.g. after
 * a backend restart, has no [prompt] or [startedAt], so it gets no [endedAt] either.
 */
data class ClaudeTurn(
    val prompt: String? = null,
    /** The task list Claude keeps for the prompt. */
    val plan: List<ClaudePlanItem> = emptyList(),
    val startedAt: Instant? = null,
    /** `null` while Claude is still on it. */
    val endedAt: Instant? = null,
    /** A shortened, plain-text version of Claude's last message, once it has stopped. */
    val result: String? = null,
) {
    /** The turn after a task list tool call (see [ClaudeTools]); calls of other tools leave it as it is. */
    fun withPlanUpdate(toolName: String?, input: JsonNode): ClaudeTurn =
        copy(plan = applyPlanUpdate(plan, toolName, input))

    /**
     * The turn once Claude has stopped, with [lastAssistantMessage] as its result if there is one. A turn that has
     * already ended keeps its end, so a repeated `Stop` doesn't make it longer.
     */
    fun ended(now: Instant, lastAssistantMessage: String? = null): ClaudeTurn = copy(
        endedAt = endedAt ?: startedAt?.let { now },
        result = lastAssistantMessage?.let(::summarizeMessage) ?: result,
    )

    companion object {
        fun started(prompt: String?, now: Instant) = ClaudeTurn(prompt = prompt, startedAt = now)
    }
}
