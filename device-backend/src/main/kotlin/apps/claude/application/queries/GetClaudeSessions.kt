package apps.claude.application.queries

import apps.claude.application.contracts.GetClaudeSessionsResponseDTO
import apps.claude.application.contracts.toDTO
import apps.claude.domain.ClaudeSessionRepository
import framework.mediator.Query
import framework.mediator.QueryHandler
import jakarta.inject.Inject

class GetClaudeSessions : Query<GetClaudeSessionsResponseDTO>

class GetClaudeSessionsQueryHandler @Inject constructor(
    private val repository: ClaudeSessionRepository,
) : QueryHandler<GetClaudeSessions, GetClaudeSessionsResponseDTO> {

    override suspend fun handle(query: GetClaudeSessions): GetClaudeSessionsResponseDTO {
        return GetClaudeSessionsResponseDTO(
            // Newest first, by start rather than last update, so the cards don't move around on the touch screen.
            sessions = repository.getAll().sortedByDescending { it.state.startedAt }.map { it.toDTO() },
        )
    }
}
