import { CssBaseline } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"
import { createQueryClient } from "@src/infrastructure/framework/query/queryClient.ts"
import { fallbackHandlers, logApiMutations } from "@src/storybook/msw.ts"
import { theme } from "@src/Theme.tsx"
import type { Preview } from "@storybook/react-vite"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { setupWorker } from "msw/browser"
import { mswLoader } from "msw-storybook-addon/csf3"
import React from "react"

import "@src/App.css"

// A fresh query client per story, so cached query data never leaks between stories
let current: { storyId: string, queryClient: QueryClient } | null = null

function getQueryClientForStory(storyId: string) {
  if (current?.storyId !== storyId) {
    current?.queryClient.clear()
    current = { storyId, queryClient: createQueryClient() }
  }
  return current.queryClient
}

const preview: Preview = {
  loaders: [
    mswLoader(async () => {
      // Initial handlers survive the handler reset between stories
      const worker = setupWorker(...fallbackHandlers)
      await worker.start({ quiet: true, onUnhandledRequest: "bypass" })
      logApiMutations(worker)
      return worker
    }),
  ],
  parameters: {
    layout: "fullscreen",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story, context) => (
      <QueryClientProvider client={getQueryClientForStory(context.id)}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Story />
        </ThemeProvider>
      </QueryClientProvider>
    ),
  ],
}

export default preview
