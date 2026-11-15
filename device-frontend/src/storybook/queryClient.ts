import { createQueryClient } from "@src/infrastructure/framework/query/queryClient.ts"
import { QueryClient } from "@tanstack/react-query"

let current: { storyId: string, queryClient: QueryClient } | null = null

/**
 * A fresh query client per story, so cached query data never leaks between stories. It's kept while the same story
 * re-renders (e.g. when its args change).
 */
export function getQueryClientForStory(storyId: string): QueryClient {
  if (current?.storyId !== storyId) {
    resetStoryQueryClient()
    current = { storyId, queryClient: createQueryClient() }
  }
  return current.queryClient
}

/** Drops the current story's query client, so tests rendering the same story don't share cached data. */
export function resetStoryQueryClient() {
  current?.queryClient.clear()
  current = null
}
