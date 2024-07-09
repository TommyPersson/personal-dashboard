package apps.github.application.commands

import apps.github.domain.GithubApiClient
import framework.mediator.Command
import framework.mediator.CommandHandler
import jakarta.inject.Inject

class MarkAllGithubNotificationsAsRead : Command<Unit>

class MarkAllGithubNotificationsAsReadCommandHandler @Inject constructor(
    private val githubApiClient: GithubApiClient,
) : CommandHandler<MarkAllGithubNotificationsAsRead, Unit> {
    override suspend fun handle(command: MarkAllGithubNotificationsAsRead) {
        githubApiClient.markAllNotificationsAsRead()
    }
}