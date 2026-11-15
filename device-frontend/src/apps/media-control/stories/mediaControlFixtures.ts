import { MediaControlStatus, PlaybackState } from "@src/apps/media-control/models/MediaControlStatus.ts"
import { MediaControlAppState } from "@src/apps/media-control/state/MediaControlAppState.ts"
import { http, HttpResponse } from "msw"
import { fn } from "storybook/test"

export const playingStatus: MediaControlStatus = {
  controls: {
    isPlayEnabled: true,
    isPauseEnabled: true,
    isPauseOrPlayEnabled: true,
    isSkipNextEnabled: true,
    isSkipPreviousEnabled: true,
  },
  mediaInfo: {
    artist: "The Placeholders",
    title: "Lorem Ipsum (Radio Edit)",
  },
  state: PlaybackState.Playing,
}

export const pausedStatus: MediaControlStatus = {
  ...playingStatus,
  state: PlaybackState.Paused,
}

export function mediaControlState(overrides: Partial<MediaControlAppState> = {}): MediaControlAppState {
  const status = overrides.status === undefined ? playingStatus : overrides.status
  return {
    status,
    isMinimized: false,
    toggleMinimized: fn(),
    ...overrides,
  }
}

export const mediaControlHandlers = [
  http.get("/api/apps/media-control/status", () => HttpResponse.json({ status: playingStatus })),
]
