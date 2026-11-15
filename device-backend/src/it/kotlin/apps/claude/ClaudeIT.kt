package apps.claude

import com.github.tomakehurst.wiremock.client.WireMock

import io.restassured.module.kotlin.extensions.Extract
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
    fun `a background task's notification resumes the turn without replacing the prompt`() {
        postEvent("UserPromptSubmit", "prompt" to "Run the tests in the background")
        postToolUse(
            "TodoWrite",
            mapOf("todos" to listOf(mapOf("content" to "Run tests", "status" to "in_progress"))),
        )
        postEvent("Stop", "last_assistant_message" to "Started the tests in the background.")

        val startedAt = When { get("/api/apps/claude/sessions") } Then {
            body("sessions[0].status", equalTo("Idle"))
        } Extract {
            path<String>("sessions[0].promptStartedAt")
        }

        postEvent(
            "UserPromptSubmit",
            "prompt" to "<task-notification>\n<task-id>bk0vgymrm</task-id>\n<status>completed</status>\n</task-notification>",
        )

        When { get("/api/apps/claude/sessions") } Then {
            body("sessions[0].prompt", equalTo("Run the tests in the background"))
            body("sessions[0].status", equalTo("Working"))
            body("sessions[0].plan.content", contains("Run tests"))
            body("sessions[0].promptStartedAt", equalTo(startedAt))
            body("sessions[0].promptEndedAt", nullValue())
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
    fun `Claude's last message is kept as a shortened plain-text result until the next prompt`() {
        postEvent("UserPromptSubmit", "prompt" to "Fix the bug")

        When { get("/api/apps/claude/sessions") } Then {
            body("sessions[0].result", nullValue())
        }

        val message = """
            ## Fixed

            The **cache** was stale; see [the docs](https://example.com) and `Cache.kt`.

            ```kotlin
            val x = 1
            ```

            | File | Change |
            |------|--------|
            | Cache.kt | Fixed |

            - Updated `Cache.kt`
        """.trimIndent() + " More words.".repeat(40)
        postEvent("Stop", "last_assistant_message" to message)

        When { get("/api/apps/claude/sessions") } Then {
            body("sessions[0].result", startsWith("Fixed\nThe cache was stale; see the docs and Cache.kt.\n• Updated Cache.kt More words."))
            body("sessions[0].result", endsWith("…"))
            body("sessions[0].result.length()", lessThanOrEqualTo(301))
        }

        postEvent("UserPromptSubmit", "prompt" to "Next")

        When { get("/api/apps/claude/sessions") } Then {
            body("sessions[0].result", nullValue())
        }
    }

    @Test
    fun `running tool calls are shown, and Claude thinking between them`() {
        postEvent("UserPromptSubmit", "prompt" to "Run the tests")

        When { get("/api/apps/claude/sessions") } Then {
            body("sessions[0].currentActivity", equalTo("Thinking…"))
        }

        postEvent(
            "PreToolUse",
            "tool_name" to "Bash",
            "tool_use_id" to "tests",
            "tool_input" to mapOf("command" to "./mvnw verify", "description" to "Run the backend tests"),
        )

        When { get("/api/apps/claude/sessions") } Then {
            body("sessions[0].status", equalTo("Working"))
            body("sessions[0].currentActivity", equalTo("Running the backend tests"))
        }

        postEvent("PostToolUse", "tool_name" to "Bash", "tool_use_id" to "tests", "tool_input" to mapOf<String, Any>())

        When { get("/api/apps/claude/sessions") } Then {
            body("sessions[0].currentActivity", equalTo("Thinking…"))
        }

        // Task list updates aren't shown.
        postEvent("PreToolUse", "tool_name" to "mcp__ccd_turn__update_plan", "tool_use_id" to "plan", "tool_input" to mapOf("advance" to true))

        When { get("/api/apps/claude/sessions") } Then {
            body("sessions[0].currentActivity", equalTo("Thinking…"))
        }

        // Calls made together finish in any order: the one still running stays shown.
        postEvent("PreToolUse", "tool_name" to "Bash", "tool_use_id" to "status", "tool_input" to mapOf("description" to "Show git status"))
        postEvent("PostToolUse", "tool_name" to "mcp__ccd_turn__update_plan", "tool_use_id" to "plan", "tool_input" to mapOf("advance" to true))

        When { get("/api/apps/claude/sessions") } Then {
            body("sessions[0].currentActivity", equalTo("Showing git status"))
        }

        postEvent("Stop")

        When { get("/api/apps/claude/sessions") } Then {
            body("sessions[0].currentActivity", nullValue())
        }
    }

    @Test
    fun `permission prompts and questions wait for input until the tool runs`() {
        postEvent("PermissionRequest", "tool_name" to "Bash", "tool_input" to mapOf("description" to "Delete the build"))

        When { get("/api/apps/claude/sessions") } Then {
            body("sessions[0].status", equalTo("WaitingForInput"))
            body("sessions[0].waitingFor", equalTo("Permission: Deleting the build"))
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

    @Test
    fun `all sessions can be discarded at once`() {
        postEvent("SessionStart", sessionId = "first")
        postEvent("SessionStart", sessionId = "second")

        When {
            post("/api/apps/claude/sessions/actions/discard-all")
        } Then {
            statusCode(200)
        }

        When { get("/api/apps/claude/sessions") } Then {
            body("sessions", empty<Any>())
        }
    }

    @Test
    fun `a notification is posted when Claude finishes its turn`() {
        postEvent("UserPromptSubmit", "prompt" to "Fix the bug")
        postEvent("Stop", "last_assistant_message" to "Fixed the **bug**.")
        // Already idle: not another finished turn.
        postEvent("Stop")

        When { get("/api/notifications") } Then {
            body("items.size()", equalTo(1))
            body("items[0].title", equalTo("Claude finished in personal-dashboard"))
            body("items[0].description", equalTo("Fixed the bug."))
            body("items[0].source", equalTo("Claude Code"))
        }

        // A session first seen through its `Stop`, e.g. after a backend restart: no turn was seen in progress.
        postEvent("Stop", sessionId = "unknown")

        When { get("/api/notifications") } Then {
            body("items.size()", equalTo(1))
        }

        postEvent("UserPromptSubmit", "prompt" to "Try again")
        postEvent("StopFailure")

        When { get("/api/notifications") } Then {
            body("items.size()", equalTo(2))
            body("items[0].title", equalTo("Claude stopped with an error in personal-dashboard"))
            body("items[0].description", equalTo("Try again"))
        }
    }

    @Test
    fun `desktop app sessions are opened on the workstation through WinCtrl`() {
        postEvent("SessionStart", "host_session_id" to "local_cfb3f127-b247-49a7-bec0-9526798df85a")
        // Later events keep the ID, and an ID the desktop app wouldn't accept is ignored.
        postEvent("UserPromptSubmit", "prompt" to "Hello")
        postEvent("SessionStart", "host_session_id" to "local_x&evil=1", sessionId = "bad-id")
        postEvent("SessionStart", sessionId = "cli")

        When { get("/api/apps/claude/sessions") } Then {
            body("sessions.find { it.id == '$SESSION_ID' }.canOpenOnWorkstation", equalTo(true))
            body("sessions.find { it.id == 'bad-id' }.canOpenOnWorkstation", equalTo(false))
            body("sessions.find { it.id == 'cli' }.canOpenOnWorkstation", equalTo(false))
        }

        When { post("/api/apps/claude/sessions/$SESSION_ID/actions/open-on-workstation") } Then { statusCode(200) }
        When { post("/api/apps/claude/sessions/cli/actions/open-on-workstation") } Then { statusCode(404) }
        When { post("/api/apps/claude/sessions/unknown/actions/open-on-workstation") } Then { statusCode(404) }

        winCtrl.verify(1, WireMock.postRequestedFor(WireMock.urlEqualTo("/api/processes/actions/open-url")))
        winCtrl.verify(
            WireMock.postRequestedFor(WireMock.urlEqualTo("/api/processes/actions/open-url"))
                .withRequestBody(WireMock.equalTo("claude://code/continue?session=local_cfb3f127-b247-49a7-bec0-9526798df85a"))
        )
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
