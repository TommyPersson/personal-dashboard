import { setupServer } from "msw/node"

/**
 * The MSW server answering the backend API in tests. It starts without handlers, and an unhandled request fails the
 * test it was made in (see `.storybook/vitest.setup.ts`).
 *
 * Suites register handlers in `beforeEach`, usually through an app's API stub (`src/apps/<app>/testing`), which keeps
 * the stubbed backend's state for the test to arrange and assert on:
 *
 * ```ts
 * let api: NotificationsApiStub
 * beforeEach(() => {
 *   api = stubNotificationsApi()
 * })
 * ```
 *
 * A test overrides a single endpoint with `server.use(...)`. Handlers are reset after every test.
 */
export const server = setupServer()
