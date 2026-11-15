package apps.claude.domain

private const val MAX_SUMMARY_LENGTH = 300

/**
 * Turns Claude's Markdown reply into a short plain-text summary for a card: code blocks, tables and Markdown markers
 * are dropped, blank lines collapsed, and the text cut at a word boundary after [MAX_SUMMARY_LENGTH] characters.
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
    if (text.length <= MAX_SUMMARY_LENGTH) {
        return text
    }

    val cut = text.substring(0, MAX_SUMMARY_LENGTH)
    return cut.substring(0, cut.lastIndexOf(' ').takeIf { it > MAX_SUMMARY_LENGTH / 2 } ?: cut.length).trimEnd() + "…"
}
