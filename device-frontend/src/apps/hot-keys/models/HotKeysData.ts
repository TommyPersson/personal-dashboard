import { z } from "zod"

export const HotKeySchema = z.object({
  id: z.string(),
  name: z.string(),
  keys: z.string(),
})

export type HotKey = z.infer<typeof HotKeySchema>

export const HotKeySectionSchema = z.object({
  name: z.string(),
  hotKeys: z.array(HotKeySchema),
})

export type HotKeySection = z.infer<typeof HotKeySectionSchema>

export const HotKeysDataSchema = z.object({
  sections: z.array(HotKeySectionSchema),
})

export type HotKeysData = z.infer<typeof HotKeysDataSchema>

export type HotKeysDataDTO = z.input<typeof HotKeysDataSchema>
