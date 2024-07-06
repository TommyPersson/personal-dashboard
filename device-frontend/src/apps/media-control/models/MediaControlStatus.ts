export type MediaControlStatus = {
  controls: {
    isPlayEnabled: boolean,
    isPauseEnabled: boolean,
    isPauseOrPlayEnabled: boolean,
    isSkipNextEnabled: boolean,
    isSkipPreviousEnabled: boolean,
  }
  mediaInfo: {
    artist: string,
    title: string,
  }
  state: PlaybackState,
}

export const enum PlaybackState {
  Closed = "Closed",
  Opened = "Opened",
  Changing = "Changing",
  Stopped = "Stopped",
  Playing = "Playing",
  Paused = "Paused",
}