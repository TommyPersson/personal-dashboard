import { apiError } from "@src/testing/apiError.ts"
import { http, HttpResponse } from "msw"
import type { SetupWorker } from "msw/browser"
// Types `parameters.msw` for CSF 3 stories
import type {} from "msw-storybook-addon/csf3"
import { action } from "storybook/actions"

/**
 * Helpers for mocking the backend with MSW in Storybook.
 *
 * Stories declare handlers through the `msw` parameter, grouped by name so a single story can override one group:
 *
 * ```ts
 * parameters: {
 *   msw: {
 *     handlers: {
 *       weather: weatherHandlers,
 *       auth: http.get("/api/auth/is-device-unlocked", () => apiError(503, "UNAVAILABLE", "Down")),
 *     },
 *   },
 * }
 * ```
 */

export { apiError }

/**
 * Lowest priority handlers, active in every story: unmocked `GET`s answer 404 and unmocked mutations answer
 * `200 {}`, so fire-and-forget actions (hot keys, run deck, ...) just work. Nothing is ever passed through to a
 * real backend.
 */
export const fallbackHandlers = [
  http.get("/api/*", ({ request }) => {
    return apiError(404, "NOT_MOCKED", `No MSW handler for GET ${new URL(request.url).pathname}`)
  }),
  http.all("/api/*", () => HttpResponse.json({})),
]

const logApiCall = action("api")

/** Logs every mutating `/api` request in the Actions panel. */
export function logApiMutations(worker: SetupWorker) {
  worker.events.on("request:start", async ({ request }) => {
    const url = new URL(request.url)
    if (!url.pathname.startsWith("/api/") || request.method === "GET") {
      return
    }
    const body = await request.clone().text()
    logApiCall(`${request.method} ${url.pathname}`, body ? safeJsonParse(body) : undefined)
  })
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}
