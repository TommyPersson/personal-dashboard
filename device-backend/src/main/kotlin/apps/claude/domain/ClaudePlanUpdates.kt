package apps.claude.domain

import com.fasterxml.jackson.databind.JsonNode

/** Applies a task list tool call (see [ClaudeTools]) to [plan]; calls of other tools leave it as it is. */
internal fun applyPlanUpdate(plan: List<ClaudePlanItem>, toolName: String?, input: JsonNode): List<ClaudePlanItem> =
    when (toolName) {
        // Only the first call of a turn has the whole list; later calls advance it or mark steps (1-based) as done
        // or started.
        ClaudeTools.UPDATE_PLAN -> {
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

        ClaudeTools.WRAP_UP -> plan.map { it.copy(status = ClaudePlanItemStatus.Completed) }

        // Every call has the whole list.
        ClaudeTools.TODO_WRITE -> input["todos"]?.let(::parsePlanItems) ?: plan

        else -> plan
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
