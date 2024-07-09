import { GithubNotification } from "@src/apps/github/models/GithubNotification.ts"
import { EntityType } from "@src/infrastructure/framework/entities"

export const GithubNotificationsEntity: EntityType<GithubNotification[]> = {
  key: "github/notifications",
  fetchUrl: "/api/apps/github/notifications",
  transform: (payload) => payload.notifications
}

