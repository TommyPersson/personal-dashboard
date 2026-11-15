import { HotKeysData } from "@src/apps/hot-keys/models/HotKeysData.ts"
import { HotKeysAppState } from "@src/apps/hot-keys/state/HotKeysAppState.ts"
import { http, HttpResponse } from "msw"

export const hotKeysData: HotKeysData = {
  sections: [
    {
      name: "IntelliJ IDEA",
      hotKeys: [
        { id: "idea-run", name: "Run", keys: "Shift+F10" },
        { id: "idea-debug", name: "Debug", keys: "Shift+F9" },
        { id: "idea-search", name: "Search everywhere", keys: "Shift Shift" },
        { id: "idea-reformat", name: "Reformat code", keys: "Ctrl+Alt+L" },
      ],
    },
    {
      name: "Global",
      hotKeys: [
        { id: "mute", name: "Toggle microphone", keys: "Ctrl+Shift+M" },
        { id: "screenshot", name: "Screenshot", keys: "Win+Shift+S" },
      ],
    },
  ],
}

export function hotKeysState(overrides: Partial<HotKeysAppState> = {}): HotKeysAppState {
  return {
    sections: hotKeysData.sections,
    ...overrides,
  }
}

export const hotKeysHandlers = [
  http.get("/api/apps/hot-keys/data", () => HttpResponse.json(hotKeysData)),
]
