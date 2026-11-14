import { CssBaseline } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"
import { DefaultObjectStore, EntityStateContextProvider } from "@src/infrastructure/framework/entities"
import { fallbackHandlers, logApiMutations } from "@src/storybook/msw.ts"
import { theme } from "@src/Theme.tsx"
import type { Preview } from "@storybook/react-vite"
import { setupWorker } from "msw/browser"
import { mswLoader } from "msw-storybook-addon/csf3"
import React from "react"

import "@src/App.css"

// A fresh entity store per story, so cached entity state never leaks between stories
let currentStore: { storyId: string, store: DefaultObjectStore } | null = null

function getStoreForStory(storyId: string) {
  if (currentStore?.storyId !== storyId) {
    currentStore = { storyId, store: new DefaultObjectStore() }
  }
  return currentStore.store
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
      <EntityStateContextProvider store={getStoreForStory(context.id)}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Story />
        </ThemeProvider>
      </EntityStateContextProvider>
    ),
  ],
}

export default preview
