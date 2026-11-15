package apps.claude.domain

import com.fasterxml.jackson.databind.JsonNode
import java.net.URI

/**
 * Describes a tool call as an ongoing activity, the way the Claude desktop app does: "Searching for XYZ" rather than
 * "Grep XYZ". A call that comes with a description (Bash, Agent) uses it, turned from "Run the tests" into
 * "Running the tests".
 */
internal fun describeToolCall(toolName: String?, input: JsonNode): String {
    input.text("description")?.let { return toActivity(it) }

    val file = input.text("file_path")?.let(::fileName)
    val pattern = input.text("pattern")

    return when (toolName) {
        "Read" -> file?.let { "Reading $it" } ?: "Reading a file"
        "Edit", "MultiEdit", "NotebookEdit" -> file?.let { "Editing $it" } ?: "Editing a file"
        "Write" -> file?.let { "Writing $it" } ?: "Writing a file"
        "Grep" -> pattern?.let { "Searching for $it" } ?: "Searching"
        "Glob" -> pattern?.let { "Finding files matching $it" } ?: "Finding files"
        "WebSearch" -> input.text("query")?.let { "Searching the web for $it" } ?: "Searching the web"
        "WebFetch" -> input.text("url")?.let { "Reading ${host(it)}" } ?: "Reading a web page"
        "Bash", "PowerShell" -> "Running a command"
        "Skill" -> input.text("skill")?.let { "Using the $it skill" } ?: "Using a skill"
        else -> "Using ${humanize(toolName?.substringAfterLast("__") ?: "a tool")}"
    }
}

/** Turns an imperative description ("Run the tests and show the output") into an activity ("Running the tests and showing the output"). */
internal fun toActivity(description: String): String {
    val words = description.trim().split(" ").toMutableList()

    words.forEachIndexed { index, word ->
        val startsClause = index == 0 || words[index - 1].lowercase() in setOf("and", "then")
        if (startsClause && word.lowercase() in verbs) {
            val gerund = gerund(word.lowercase())
            words[index] = if (index == 0) gerund.replaceFirstChar { it.uppercase() } else gerund
        }
    }

    return words.joinToString(" ")
}

private fun gerund(verb: String): String = when {
    verb in doubledFinalConsonant -> verb + verb.last() + "ing"
    verb.endsWith("ie") -> verb.dropLast(2) + "ying"
    verb.endsWith("e") && !verb.endsWith("ee") -> verb.dropLast(1) + "ing"
    else -> verb + "ing"
}

/** Verbs that commonly start a tool call's description. Other first words, such as "npm" or "git", are kept as they are. */
private val verbs = setOf(
    "add", "analyze", "apply", "build", "bump", "call", "check", "clean", "clone", "commit", "compare", "compile",
    "configure", "convert", "copy", "count", "create", "debug", "delete", "deploy", "diff", "display", "download",
    "edit", "execute", "export", "extract", "fetch", "find", "fix", "format", "generate", "get", "import", "inspect",
    "install", "kill", "launch", "lint", "list", "load", "locate", "look", "make", "merge", "move", "open", "package",
    "parse", "print", "pull", "push", "query", "read", "rebuild", "remove", "rename", "render", "replace", "reset",
    "restart", "restore", "retry", "run", "save", "scan", "search", "send", "set", "show", "start", "stop", "sync",
    "test", "update", "upgrade", "upload", "validate", "verify", "view", "wait", "watch", "write",
)

private val doubledFinalConsonant = setOf("debug", "get", "run", "set", "stop")

private fun fileName(path: String) = path.substringAfterLast('/').substringAfterLast('\\')

private fun host(url: String) = runCatching { URI(url).host }.getOrNull() ?: url

/** "browser_batch" or "update_plan" → "browser batch", "update plan". */
private fun humanize(name: String) = name.replace('_', ' ').replace(Regex("([a-z])([A-Z])"), "$1 $2").lowercase()
