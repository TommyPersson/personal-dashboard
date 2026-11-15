import "@testing-library/jest-dom/vitest"

import { resetStoryQueryClient } from "@src/storybook/queryClient.ts"
import { server } from "@src/testing/msw.ts"
import { setProjectAnnotations } from "@storybook/react-vite"
import { cleanup } from "@testing-library/react"
import { Settings } from "luxon"
import { afterAll, afterEach, beforeAll } from "vitest"

import preview from "./preview.tsx"

// Stories render with the same decorators (theme, query client) as in Storybook.
setProjectAnnotations(preview)

// The device's time zone, so formatted times don't depend on the machine running the tests.
Settings.defaultZone = "Europe/Stockholm"

// Requests no handler answered, reported as a failure of the test that made them
const unhandledRequests: string[] = []

beforeAll(() => {
  server.listen({
    // Still errors the request, so the code under test sees it fail as it would against a down backend
    onUnhandledFrame: ({ frame, defaults }) => {
      const request = frame.protocol === "http" ? (frame.data as { request: Request }).request : null
      unhandledRequests.push(request ? `${request.method} ${new URL(request.url).pathname}` : frame.protocol)
      defaults.error()
    },
  })
})

afterEach(() => {
  cleanup()
  // Each test gets its own cache, even when rendering the same story as the one before
  resetStoryQueryClient()
  server.resetHandlers()

  const unhandled = unhandledRequests.splice(0)
  if (unhandled.length > 0) {
    throw new Error(`Requests without an MSW handler (stub them in the suite):\n  ${unhandled.join("\n  ")}`)
  }
})

afterAll(() => {
  server.close()
})
