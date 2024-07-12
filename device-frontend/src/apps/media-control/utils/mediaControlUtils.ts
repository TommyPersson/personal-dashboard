import { MediaControlStatus } from "@src/apps/media-control/models/MediaControlStatus.ts"


export function getThumbnailImageSrc(status: MediaControlStatus | null) {
  const title = status?.mediaInfo?.title ?? "unknown"
  const encodedTitle = encodeURIComponent(title)
  return `url("/api/apps/media-control/thumbnail?cache-buster=${encodedTitle}")`
}