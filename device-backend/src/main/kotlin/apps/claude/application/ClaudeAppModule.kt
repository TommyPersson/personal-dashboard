package apps.claude.application

import apps.claude.application.commands.DiscardAllClaudeSessions
import apps.claude.application.commands.DiscardClaudeSession
import apps.claude.application.commands.HandleClaudeHookEvent
import apps.claude.application.queries.GetClaudeSessions
import apps.claude.domain.ClaudeHookEvent
import com.fasterxml.jackson.databind.JsonNode
import common.contracts.OkResponseDTO
import framework.AppModule
import framework.mediator.Mediator
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.util.*
import jakarta.inject.Inject

class ClaudeAppModule @Inject constructor(
    private val mediator: Mediator,
) : AppModule {
    override fun setup(app: Application) {
        app.routing {
            // Posted by the Claude Code hook script on the workstation (tools/claude-hooks).
            post("/api/apps/claude/events") {
                val event = call.receive<JsonNode>()
                mediator.send(HandleClaudeHookEvent(ClaudeHookEvent(event)))
                call.respond(OkResponseDTO())
            }

            get("/api/apps/claude/sessions") {
                call.respond(mediator.send(GetClaudeSessions()))
            }

            post("/api/apps/claude/sessions/actions/discard-all") {
                mediator.send(DiscardAllClaudeSessions())
                call.respond(OkResponseDTO())
            }

            post("/api/apps/claude/sessions/{id}/actions/discard") {
                mediator.send(DiscardClaudeSession(call.parameters.getOrFail("id")))
                call.respond(OkResponseDTO())
            }
        }
    }
}
