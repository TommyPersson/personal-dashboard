import { MediaControlStatusSchema } from "@src/apps/media-control/models/MediaControlStatus.ts"
import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { queryOptions } from "@tanstack/react-query"
import { z } from "zod"

export const MediaControlStatusQueryKey = ["mediaControl", "status"] as const

const MediaControlStatusResponseSchema = z.object({
  /** Null while nothing is playing on the workstation. */
  status: MediaControlStatusSchema.nullable(),
})

export const MediaControlStatusQuery = queryOptions({
  queryKey: MediaControlStatusQueryKey,
  queryFn: async () => {
    const dto = await apiClient.get<unknown>("/api/apps/media-control/status")
    return MediaControlStatusResponseSchema.parse(dto).status
  },
})
