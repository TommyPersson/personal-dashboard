package apps.github

import com.github.tomakehurst.wiremock.client.WireMock
import com.github.tomakehurst.wiremock.client.WireMock.*
import io.restassured.module.kotlin.extensions.Then
import io.restassured.module.kotlin.extensions.When
import org.hamcrest.Matchers.contains
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import testing.IntegrationTest
import testing.TestConfigs

class GithubIT : IntegrationTest() {

    private val github get() = backend.githubMock

    @Test
    fun `notifications are fetched from GitHub with the configured token`() {
        github.stubFor(
            get("/notifications").willReturn(
                okJson(
                    """
                    [
                      {
                        "id": "1001",
                        "unread": true,
                        "reason": "review_requested",
                        "updated_at": "2026-11-14T09:30:00Z",
                        "last_read_at": null,
                        "subject": {
                          "title": "Add integration tests",
                          "url": "https://api.github.com/repos/octo/dashboard/pulls/42",
                          "latest_comment_url": null,
                          "type": "PullRequest"
                        },
                        "repository": { "id": 7, "name": "dashboard", "full_name": "octo/dashboard" },
                        "url": "https://api.github.com/notifications/threads/1001"
                      }
                    ]
                    """
                )
            )
        )

        When {
            get("/api/apps/github/notifications")
        } Then {
            statusCode(200)
            body("notifications.id", contains(1001))
            body("notifications[0].title", equalTo("Add integration tests"))
            body("notifications[0].type", equalTo("PullRequest"))
            body("notifications[0].reason", equalTo("review_requested"))
            body("notifications[0].repositoryFullName", equalTo("octo/dashboard"))
            body("notifications[0].unread", equalTo(true))
            body("notifications[0].updatedAt", equalTo("2026-11-14T09:30:00Z"))
        }

        github.verify(
            getRequestedFor(urlEqualTo("/notifications"))
                .withHeader("Authorization", WireMock.equalTo("Bearer ${TestConfigs.GITHUB_ACCESS_TOKEN}"))
        )
    }

    @Test
    fun `marking all notifications as read is sent to GitHub`() {
        github.stubFor(put("/notifications").willReturn(aResponse().withStatus(205)))

        When {
            post("/api/apps/github/notifications/actions/mark-all-as-read")
        } Then {
            statusCode(200)
        }

        github.verify(
            putRequestedFor(urlEqualTo("/notifications"))
                .withHeader("Authorization", WireMock.equalTo("Bearer ${TestConfigs.GITHUB_ACCESS_TOKEN}"))
                .withRequestBody(matchingJsonPath("$.read", WireMock.equalTo("true")))
                .withRequestBody(matchingJsonPath("$.last_read_at"))
        )
    }
}
