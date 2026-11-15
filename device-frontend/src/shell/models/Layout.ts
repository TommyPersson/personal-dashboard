import { AppWidgetProvider } from "@src/common/AppWidgetProvider.ts"
import { z } from "zod"

export const LayoutDTOSchema = z.object({
  apps: z.array(z.object({
    appId: z.string(),
  })),
})

export type LayoutDTO = z.input<typeof LayoutDTOSchema>

/** The apps to show, in order. Apps the frontend doesn't know are left out. */
export type Layout = {
  apps: AppWidgetProvider[]
}
