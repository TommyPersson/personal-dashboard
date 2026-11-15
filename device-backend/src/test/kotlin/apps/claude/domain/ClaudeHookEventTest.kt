package apps.claude.domain

import com.fasterxml.jackson.module.kotlin.readValue
import utils.JSON
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertIs
import kotlin.test.assertNull
import kotlin.test.assertTrue

class ClaudeHookEventTest {

    private fun parse(json: String): ClaudeHookEvent = JSON.objectMapper.readValue(json)

    @Test
    fun `events are deserialized by their name, with the common fields`() {
        val event = parse(
            """
            {
              "hook_event_name": "PreToolUse",
              "session_id": "abc",
              "cwd": "C:/work/x",
              "host_session_id": "local_123",
              "tool_name": "Bash",
              "tool_input": { "command": "ls" },
              "tool_use_id": "toolu_1",
              "permission_mode": "default"
            }
            """
        )

        assertIs<ClaudeHookEvent.PreToolUse>(event)
        assertEquals("abc", event.sessionId)
        assertEquals("C:/work/x", event.cwd)
        assertEquals("local_123", event.desktopSessionId)
        assertEquals("Bash", event.toolName)
        assertEquals("ls", event.toolInput["command"].asText())
        assertEquals("toolu_1", event.toolUseId)
        assertFalse(event.hasWorktreeInfo)
    }

    @Test
    fun `the project directory wins over the working directory`() {
        val event = parse("""{ "hook_event_name": "Stop", "cwd": "C:/work/x/sub", "project_dir": "C:/work/x" }""")

        assertEquals("C:/work/x", event.cwd)
    }

    @Test
    fun `unknown and missing event names become Other`() {
        assertIs<ClaudeHookEvent.Other>(parse("""{ "hook_event_name": "PreCompact", "session_id": "abc" }"""))
        assertIs<ClaudeHookEvent.Other>(parse("""{ "session_id": "abc" }"""))
    }

    @Test
    fun `desktop session IDs other than local ones are ignored`() {
        assertNull(parse("""{ "hook_event_name": "Stop", "host_session_id": "remote_1" }""").desktopSessionId)
    }

    @Test
    fun `a null worktree is worktree info, an absent one is not`() {
        val withWorktree = parse(
            """{ "hook_event_name": "Stop", "git_worktree": { "path": "C:/wt", "branch": "b", "repository_dir": "C:/repo" } }"""
        )
        assertTrue(withWorktree.hasWorktreeInfo)
        assertEquals(ClaudeWorktree(path = "C:/wt", branch = "b", repositoryDir = "C:/repo"), withWorktree.worktree)

        val nullWorktree = parse("""{ "hook_event_name": "Stop", "git_worktree": null }""")
        assertTrue(nullWorktree.hasWorktreeInfo)
        assertNull(nullWorktree.worktree)

        assertFalse(parse("""{ "hook_event_name": "Stop" }""").hasWorktreeInfo)
    }

    @Test
    fun `event specific fields are read`() {
        val stop = assertIs<ClaudeHookEvent.Stop>(parse("""{ "hook_event_name": "Stop", "last_assistant_message": "Done" }"""))
        assertEquals("Done", stop.lastAssistantMessage)

        val prompt = assertIs<ClaudeHookEvent.UserPromptSubmit>(
            parse("""{ "hook_event_name": "UserPromptSubmit", "prompt": "<system-reminder>x</system-reminder>" }""")
        )
        assertTrue(prompt.isSystemPrompt)

        val end = assertIs<ClaudeHookEvent.SessionEnd>(parse("""{ "hook_event_name": "SessionEnd", "reason": "clear" }"""))
        assertEquals("clear", end.reason)
    }
}
