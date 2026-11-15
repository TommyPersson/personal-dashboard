import { CssBaseline } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"
import { DefaultObjectStore, EntityStateContextProvider } from "@src/infrastructure/framework/entities"
import { createQueryClient } from "@src/infrastructure/framework/query/queryClient.ts"
import { fallbackHandlers, logApiMutations } from "@src/storybook/msw.ts"
import { theme } from "@src/Theme.tsx"
import type { Preview } from "@storybook/react-vite"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { setupWorker } from "msw/browser"
import { mswLoader } from "msw-storybook-addon/csf3"
import React from "react"

import "@src/App.css"

// A fresh entity store and query client per story, so cached state never leaks between stories
let currentStores: { storyId: string, store: DefaultObjectStore, queryClient: QueryClient } | null = null

function getStoresForStory(storyId: string) {
  if (currentStores?.storyId !== storyId) {
    currentStores?.queryClient.clear()
    currentStores = { storyId, store: new DefaultObjectStore(), queryClient: createQueryClient() }
  }
  return currentStores
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
    (Story, context) => {
      const { store, queryClient } = getStoresForStory(context.id)
      return (
        <QueryClientProvider client={queryClient}>
          <EntityStateContextProvider store={store}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Story />
            </ThemeProvider>
          </EntityStateContextProvider>
        </QueryClientProvider>
      )
    },
  ],
}

export default preview
