package apps.claude.domain

import com.fasterxml.jackson.databind.JsonNode

/** The field's value if it is a string, else `null`. */
internal fun JsonNode.text(field: String): String? = get(field)?.takeIf { it.isTextual }?.asText()
