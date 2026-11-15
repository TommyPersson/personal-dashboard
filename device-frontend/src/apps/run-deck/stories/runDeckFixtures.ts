import { RunDeckData } from "@src/apps/run-deck/models/RunDeckData.ts"
import { RunDeckAppState } from "@src/apps/run-deck/state/RunDeckAppState.ts"
import { http, HttpResponse } from "msw"

export const runDeckData: RunDeckData = {
  sections: [
    {
      name: "Development",
      rows: [
        {
          items: [
            { id: "idea", text: "IntelliJ IDEA", type: "RunExecutable" },
            { id: "terminal", text: "Terminal", type: "RunExecutable" },
            { id: "docker", text: "Docker Desktop", type: "RunExecutable" },
          ],
        },
        {
          items: [
            { id: "github", text: "GitHub", type: "OpenUrl" },
            { id: "ci", text: "CI", type: "OpenUrl" },
          ],
        },
      ],
    },
    {
      name: "Communication",
      rows: [
        {
          items: [
            { id: "slack", text: "Slack", type: "RunExecutable" },
            { id: "mail", text: "Mail", type: "OpenUrl" },
          ],
        },
      ],
    },
  ],
}

export function runDeckState(overrides: Partial<RunDeckAppState> = {}): RunDeckAppState {
  return {
    sections: runDeckData.sections,
    ...overrides,
  }
}

export const runDeckHandlers = [
  http.get("/api/apps/run-deck/data", () => HttpResponse.json(runDeckData)),
]
