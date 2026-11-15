import { render, RenderResult } from "@testing-library/react"
import React from "react"

/**
 * Renders a story composed with `composeStories`, including the project's decorators. Story loaders and the story's
 * `msw` parameter are not used: requests are answered by the handlers the suite registers on the test server
 * (`src/testing/msw.ts`).
 */
export function renderStory(Story: React.ComponentType): RenderResult {
  return render(<Story />)
}
