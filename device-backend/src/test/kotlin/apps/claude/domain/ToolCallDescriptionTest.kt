package apps.claude.domain

import com.fasterxml.jackson.databind.ObjectMapper
import kotlin.test.Test
import kotlin.test.assertEquals

class ToolCallDescriptionTest {

    @Test
    fun `descriptions are phrased as activities`() {
        assertEquals("Listing frontend apps and showing git status", toActivity("List frontend apps and show git status"))
        assertEquals("Running the tests, then stopping", toActivity("Run the tests, then stop"))
        assertEquals("Creating a branch and writing the file", toActivity("Create a branch and write the file"))
        assertEquals("Verifying the build", toActivity("Verify the build"))
    }

    @Test
    fun `descriptions that don't start with a known verb are kept`() {
        assertEquals("npm install", toActivity("npm install"))
        assertEquals("Git status of the repo", toActivity("Git status of the repo"))
    }

    @Test
    fun `tools without a description are described from their input`() {
        assertEquals("Searching for currentActivity", describe("Grep", """{"pattern": "currentActivity"}"""))
        assertEquals("Reading ClaudeIT.kt", describe("Read", """{"file_path": "C:\\work\\it\\ClaudeIT.kt"}"""))
        assertEquals("Editing Foo.kt", describe("Edit", """{"file_path": "/src/Foo.kt"}"""))
        assertEquals("Finding files matching **/*.tsx", describe("Glob", """{"pattern": "**/*.tsx"}"""))
        assertEquals("Reading example.com", describe("WebFetch", """{"url": "https://example.com/docs"}"""))
        assertEquals("Searching the web for kotlin", describe("WebSearch", """{"query": "kotlin"}"""))
        assertEquals("Running the tests", describe("Bash", """{"command": "mvn", "description": "Run the tests"}"""))
        assertEquals("Running a command", describe("Bash", """{"command": "mvn"}"""))
        assertEquals("Using browser batch", describe("mcp__Claude_Browser__browser_batch", "{}"))
    }

    private fun describe(tool: String, input: String) = describeToolCall(tool, ObjectMapper().readTree(input))
}
