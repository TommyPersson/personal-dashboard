package apps.bitbucket

import com.github.tomakehurst.wiremock.client.WireMock
import com.github.tomakehurst.wiremock.client.WireMock.*
import io.restassured.module.kotlin.extensions.Then
import io.restassured.module.kotlin.extensions.When
import org.hamcrest.Matchers.contains
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import testing.IntegrationTest
import testing.TestConfigs
import java.util.*

class BitbucketIT : IntegrationTest() {

    private val bitbucket get() = backend.bitbucketMock

    @Test
    fun `pull requests are fetched from the Bitbucket dashboard`() {
        bitbucket.stubFor(
            get("/rest/api/latest/dashboard/pull-requests").willReturn(
                okJson(
                    """
                    {
                      "size": 1, "limit": 25, "start": 0, "isLastPage": true,
                      "values": [
                        {
                          "id": 17,
                          "version": 3,
                          "title": "Fix the flux capacitor",
                          "description": null,
                          "state": "OPEN",
                          "createdDate": 1763112600000,
                          "updatedDate": 1763116200000,
                          "fromRef": {
                            "id": "refs/heads/feature/flux", "displayId": "feature/flux", "type": "BRANCH",
                            "repository": { "id": 1, "slug": "delorean", "name": "delorean",
                                            "project": { "id": 1, "key": "TIME", "name": "Time" } }
                          },
                          "toRef": {
                            "id": "refs/heads/main", "displayId": "main", "type": "BRANCH",
                            "repository": { "id": 1, "slug": "delorean", "name": "delorean",
                                            "project": { "id": 1, "key": "TIME", "name": "Time" } }
                          },
                          "author": {
                            "user": { "name": "emmett", "displayName": "Emmett Brown" },
                            "role": "AUTHOR", "status": "UNAPPROVED"
                          },
                          "reviewers": [
                            {
                              "user": { "name": "${TestConfigs.BITBUCKET_USERNAME}", "displayName": "Jane Doe" },
                              "role": "REVIEWER", "status": "APPROVED"
                            }
                          ],
                          "properties": { "resolvedTaskCount": 1, "openTaskCount": 2, "commentCount": 5 },
                          "links": { "self": [ { "href": "https://bitbucket.example.com/projects/TIME/repos/delorean/pull-requests/17" } ] }
                        }
                      ]
                    }
                    """
                )
            )
        )

        When {
            get("/api/apps/bitbucket/pull-requests")
        } Then {
            statusCode(200)
            body("pullRequests.id", contains(17))
            body("pullRequests[0].title", equalTo("Fix the flux capacitor"))
            body("pullRequests[0].description", equalTo(""))
            body("pullRequests[0].state", equalTo("OPEN"))
            body("pullRequests[0].fromBranch", equalTo("feature/flux"))
            body("pullRequests[0].toBranch", equalTo("main"))
            body("pullRequests[0].author.name", equalTo("Emmett Brown"))
            body("pullRequests[0].reviewers.name", contains("Jane Doe"))
            body("pullRequests[0].belongsToUser", equalTo(false))
            body("pullRequests[0].userHasApproved", equalTo(true))
            body("pullRequests[0].numComments", equalTo(5))
            body("pullRequests[0].numOpenTasks", equalTo(2))
            body("pullRequests[0].numResolvedTasks", equalTo(1))
            body("pullRequests[0].url", equalTo("https://bitbucket.example.com/projects/TIME/repos/delorean/pull-requests/17"))
            body("pullRequests[0].createdAt", equalTo("2025-11-14T09:30:00Z"))
            body("pullRequests[0].updatedAt", equalTo("2025-11-14T10:30:00Z"))
        }

        val credentials = "${TestConfigs.BITBUCKET_USERNAME}:${TestConfigs.BITBUCKET_ACCESS_TOKEN}"
        bitbucket.verify(
            getRequestedFor(urlEqualTo("/rest/api/latest/dashboard/pull-requests"))
                .withHeader("Authorization", WireMock.equalTo("Basic " + Base64.getEncoder().encodeToString(credentials.toByteArray())))
        )
    }
}
