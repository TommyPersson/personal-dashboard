import { MediaControlStatus } from "@src/apps/media-control/models/MediaControlStatus.ts"
import { EntityType } from "@src/infrastructure/framework/entities"

export const MediaControlStatusEntity: EntityType<MediaControlStatus | null> = {
  key: "mediaControlStatus",
  fetchUrl: "/api/apps/media-control/status",
  transform: (payload: any) => payload.status as MediaControlStatus | null,
}

