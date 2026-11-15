import { z } from "zod"

export const PlaybackStateSchema = z.enum(["Closed", "Opened", "Changing", "Stopped", "Playing", "Paused"])

/** Used like an enum, e.g. `PlaybackState.Playing`. */
export const PlaybackState = PlaybackStateSchema.enum

export type PlaybackState = z.infer<typeof PlaybackStateSchema>

export const MediaControlStatusSchema = z.object({
  controls: z.object({
    isPlayEnabled: z.boolean(),
    isPauseEnabled: z.boolean(),
    isPauseOrPlayEnabled: z.boolean(),
    isSkipNextEnabled: z.boolean(),
    isSkipPreviousEnabled: z.boolean(),
  }),
  mediaInfo: z.object({
    artist: z.string(),
    title: z.string(),
  }),
  state: PlaybackStateSchema,
})

export type MediaControlStatus = z.infer<typeof MediaControlStatusSchema>

export type MediaControlStatusDTO = z.input<typeof MediaControlStatusSchema>
