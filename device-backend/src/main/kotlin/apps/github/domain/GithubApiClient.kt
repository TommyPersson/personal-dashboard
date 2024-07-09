package apps.github.domain

import apps.github.domain.model.GithubApiNotificationDTO

interface GithubApiClient {
    suspend fun getNotifications(): List<GithubApiNotificationDTO>
    suspend fun markAllNotificationsAsRead()
}
