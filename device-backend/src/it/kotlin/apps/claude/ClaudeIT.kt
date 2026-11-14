package apps.claude

import io.restassured.module.kotlin.extensions.Given
import io.restassured.module.kotlin.extensions.Then
import io.restassured.module.kotlin.extensions.When
import org.hamcrest.Matchers.*
import org.junit.jupiter.api.Test
import testing.IntegrationTest

class ClaudeIT : IntegrationTest() {

    @Test
    fun `a prompt starts a working session`() {
        postEvent("UserPromptSubmit", "prompt" to "Add a Claude app")

        When {
            get("/api/apps/claude/sessions")
        } Then {
            statusCode(200)
            body("sessions.id", contains(SESSION_ID))
            body("sessions[0].project", equalTo("personal-dashboard"))
            body("sessions[0].prompt", equalTo("Add a Claude app"))
            body("sessions[0].status", equalTo("Working"))
            body("sessions[0].plan", empty<Any>())
        }
    }

    @Test
    fun `the project is the session's project directory rather than the shell's working directory`() {
        postEvent(
            "PostToolUse",
            "tool_name" to "Bash",
            "cwd" to "C:\\work\\personal-dashboard\\device-backend\\target",
            "project_dir" to "C:\\work\\personal-dashboard",
        )

        When { get("/api/apps/claude/sessions") } Then {
            body("sessions[0].project", equalTo("personal-dashboard"))
        }
    }

    @Test
    fun `the desktop app's task list is folded from its updates`() {
        postEvent("UserPromptSubmit", "prompt" to "Do things")
        postToolUse(
            "mcp__ccd_turn__update_plan",
            mapOf(
                "items" to listOf(
                    mapOf("content" to "First", "status" to "in_progress"),
                    mapOf("content" to "Second", "status" to "pending"),
                    mapOf("content" to "Third", "status" to "pending"),
                ),
            ),
        )
        postToolUse("mcp__ccd_turn__update_plan", mapOf("advance" to true))

        When { get("/api/apps/claude/sessions") } Then {
            body("sessions[0].plan.content", contains("First", "Second", "Third"))
            body("sessions[0].plan.status", contains("Completed", "InProgress", "Pending"))
        }

        postToolUse("mcp__ccd_turn__update_plan", mapOf("done" to listOf(2), "start" to 3))

        When { get("/api/apps/claude/sessions") } Then {
            body("sessions[0].plan.status", contains("Completed", "Completed", "InProgress"))
        }

        postToolUse("mcp__ccd_turn__wrap_up", mapOf("recap" to "Done"))

        When { get("/api/apps/claude/sessions") } Then {
            body("sessions[0].plan.status", contains("Completed", "Completed", "Completed"))
        }
    }

    @Test
    fun `the CLI's todo list replaces the plan`() {
        postToolUse(
            "TodoWrite",
            mapOf("todos" to listOf(mapOf("content" to "Write tests", "status" to "completed", "activeForm" to "Writing tests"))),
        )

        When { get("/api/apps/claude/sessions") } Then {
            body("sessions[0].plan.content", contains("Write tests"))
            body("sessions[0].plan.status", contains("Completed"))
        }
    }

    @Test
    fun `a new prompt clears the plan`() {
        postToolUse(
            "TodoWrite",
            mapOf("todos" to listOf(mapOf("content" to "Old step", "status" to "pending"))),
        )
        postEvent("UserPromptSubmit", "prompt" to "Something else")

        When { get("/api/apps/claude/sessions") } Then {
            body("sessions[0].prompt", equalTo("Something else"))
            body("sessions[0].plan", empty<Any>())
        }
    }

    @Test
    fun `a prompt's run time starts when it is submitted and ends when Claude stops`() {
        postEvent("UserPromptSubmit", "prompt" to "Do things")

        When { get("/api/apps/claude/sessions") } Then {
            body("sessions[0].promptStartedAt", notNullValue())
            body("sessions[0].promptEndedAt", nullValue())
        }

        postEvent("Stop")

        When { get("/api/apps/claude/sessions") } Then {
            body("sessions[0].promptStartedAt", notNullValue())
            body("sessions[0].promptEndedAt", notNullValue())
        }

        postEvent("UserPromptSubmit", "prompt" to "More things")

        When { get("/api/apps/claude/sessions") } Then {
            body("sessions[0].promptEndedAt", nullValue())
        }
    }

    @Test
    fun `a running tool call is shown until it finishes`() {
        postEvent(
            "PreToolUse",
            "tool_name" to "Bash",
            "tool_input" to mapOf("command" to "./mvnw verify", "description" to "Run the backend tests"),
        )

        When { get("/api/apps/claude/sessions") } Then {
            body("sessions[0].status", equalTo("Working"))
            body("sessions[0].currentActivity", equalTo("Run the backend tests"))
        }

        postToolUse("Bash", mapOf("command" to "./mvnw verify"))

        When { get("/api/apps/claude/sessions") } Then {
            body("sessions[0].currentActivity", nullValue())
        }
    }

    @Test
    fun `permission prompts and questions wait for input until the tool runs`() {
        postEvent("PermissionRequest", "tool_name" to "Bash", "tool_input" to mapOf("description" to "Delete the build"))

        When { get("/api/apps/claude/sessions") } Then {
            body("sessions[0].status", equalTo("WaitingForInput"))
            body("sessions[0].waitingFor", equalTo("Permission: Delete the build"))
        }

        postToolUse("Bash", mapOf("description" to "Delete the build"))
        postEvent(
            "PreToolUse",
            "tool_name" to "AskUserQuestion",
            "tool_input" to mapOf("questions" to listOf(mapOf("question" to "Which database?"))),
        )

        When { get("/api/apps/claude/sessions") } Then {
            body("sessions[0].status", equalTo("WaitingForInput"))
            body("sessions[0].waitingFor", equalTo("Which database?"))
        }

        postEvent("Stop")

        When { get("/api/apps/claude/sessions") } Then {
            body("sessions[0].status", equalTo("Idle"))
            body("sessions[0].waitingFor", nullValue())
        }
    }

    @Test
    fun `sessions are removed when they end or are discarded`() {
        postEvent("SessionStart", sessionId = "ending")
        postEvent("SessionStart", sessionId = "discarded")
        postEvent("SessionStart", sessionId = "kept")

        postEvent("SessionEnd", sessionId = "ending")

        When {
            post("/api/apps/claude/sessions/discarded/actions/discard")
        } Then {
            statusCode(200)
        }

        When { get("/api/apps/claude/sessions") } Then {
            body("sessions.id", contains("kept"))
        }
    }

    private fun postToolUse(toolName: String, toolInput: Map<String, Any>) =
        postEvent("PostToolUse", "tool_name" to toolName, "tool_input" to toolInput)

    private fun postEvent(hookEventName: String, vararg fields: Pair<String, Any>, sessionId: String = SESSION_ID) {
        val event = mapOf(
            "session_id" to sessionId,
            "cwd" to "C:\\work\\personal-dashboard",
            "hook_event_name" to hookEventName,
        ) + fields

        Given {
            jsonBody(event)
        } When {
            post("/api/apps/claude/events")
        } Then {
            statusCode(200)
        }
    }

    private companion object {
        const val SESSION_ID = "session-1"
    }
}
