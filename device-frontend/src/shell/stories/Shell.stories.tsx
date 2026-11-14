import App from "@src/App.tsx"
import { allAppWidgetProviders } from "@src/apps/AllAppWidgetProviders.ts"
import { bitbucketHandlers } from "@src/apps/bitbucket/stories/bitbucketFixtures.ts"
import { calendarHandlers } from "@src/apps/calendar/stories/calendarFixtures.ts"
import { clockHandlers } from "@src/apps/clock/stories/clockFixtures.ts"
import { githubHandlers } from "@src/apps/github/stories/githubFixtures.ts"
import { hotKeysHandlers } from "@src/apps/hot-keys/stories/hotKeysFixtures.ts"
import { mediaControlHandlers } from "@src/apps/media-control/stories/mediaControlFixtures.ts"
import { notificationsHandlers } from "@src/apps/notifications/stories/notificationsFixtures.ts"
import { runDeckHandlers } from "@src/apps/run-deck/stories/runDeckFixtures.ts"
import { weatherHandlers } from "@src/apps/weather/stories/weatherFixtures.ts"
import { apiError } from "@src/storybook/msw.ts"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { http, HttpResponse } from "msw"

/** The pin code that unlocks the device in these stories. */
const pinCode = "1234"

let isUnlocked = false

const authHandlers = [
  http.get("/api/auth/is-device-unlocked", () => HttpResponse.json({ isDeviceUnlocked: isUnlocked })),
  http.post<never, { pinCode: string }>("/api/auth/unlock-device", async ({ request }) => {
    const body = await request.json()
    if (body.pinCode !== pinCode) {
      return apiError(403, "INVALID_PIN_CODE", "Invalid pin code")
    }
    isUnlocked = true
    return HttpResponse.json({})
  }),
  http.post("/api/auth/lock-device", () => {
    isUnlocked = false
    return HttpResponse.json({})
  }),
]

const layoutHandlers = [
  http.get("/api/layout", () => HttpResponse.json({ apps: allAppWidgetProviders.map(it => ({ appId: it.id })) })),
]

/**
 * The whole application with every API mocked by MSW. Locking and unlocking works (pin code `1234`); everything
 * else that would talk to the PC is just logged in the Actions panel.
 */
const meta = {
  title: "Shell/App",
  component: App,
  parameters: {
    msw: {
      handlers: {
        auth: authHandlers,
        layout: layoutHandlers,
        clock: clockHandlers,
        weather: weatherHandlers,
        calendar: calendarHandlers,
        mediaControl: mediaControlHandlers,
        hotKeys: hotKeysHandlers,
        runDeck: runDeckHandlers,
        bitbucket: bitbucketHandlers,
        github: githubHandlers,
        notifications: notificationsHandlers,
      },
    },
  },
} satisfies Meta<typeof App>

export default meta

type Story = StoryObj<typeof meta>

export const Unlocked: Story = {
  beforeEach: () => {
    isUnlocked = true
  },
}

export const Locked: Story = {
  beforeEach: () => {
    isUnlocked = false
  },
}

export const ServerUnreachable: Story = {
  parameters: {
    msw: {
      handlers: {
        auth: http.get("/api/auth/is-device-unlocked", () => apiError(503, "UNAVAILABLE", "Server unreachable")),
      },
    },
  },
}
