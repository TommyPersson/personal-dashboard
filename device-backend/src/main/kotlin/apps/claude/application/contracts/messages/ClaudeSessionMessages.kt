package apps.claude.application.contracts.messages

import apps.claude.application.contracts.ClaudeSessionDTO
import com.fasterxml.jackson.annotation.JsonTypeName
import common.services.Message

@JsonTypeName("ClaudeSessionUpdated")
data class ClaudeSessionUpdatedMessageDTO(
    val session: ClaudeSessionDTO,
) : Message

@JsonTypeName("ClaudeSessionRemoved")
data class ClaudeSessionRemovedMessageDTO(
    val sessionId: String,
) : Message
