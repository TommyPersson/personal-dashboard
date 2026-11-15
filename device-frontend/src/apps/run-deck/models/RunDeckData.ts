import { z } from "zod"

const BaseItemSchema = z.object({
  id: z.string(),
  text: z.string(),
})

export const RunExecutableItemSchema = BaseItemSchema.extend({
  type: z.literal("RunExecutable"),
})

export type RunExecutableItem = z.infer<typeof RunExecutableItemSchema>

export const OpenUrlItemSchema = BaseItemSchema.extend({
  type: z.literal("OpenUrl"),
})

export type OpenUrlItem = z.infer<typeof OpenUrlItemSchema>

export const ItemSchema = z.discriminatedUnion("type", [RunExecutableItemSchema, OpenUrlItemSchema])

export type Item = z.infer<typeof ItemSchema>

export const RowSchema = z.object({
  items: z.array(ItemSchema),
})

export type Row = z.infer<typeof RowSchema>

export const SectionSchema = z.object({
  name: z.string(),
  rows: z.array(RowSchema),
})

export type Section = z.infer<typeof SectionSchema>

export const RunDeckDataSchema = z.object({
  sections: z.array(SectionSchema),
})

export type RunDeckData = z.infer<typeof RunDeckDataSchema>

export type RunDeckDataDTO = z.input<typeof RunDeckDataSchema>
