import { render, RenderResult } from "@testing-library/react"
import React from "react"

/**
 * Renders a story composed with `composeStories`, including the project's decorators. Story loaders (e.g. MSW) are
 * not run, so only stories that get their data through args can be rendered this way.
 */
export function renderStory(Story: React.ComponentType): RenderResult {
  return render(<Story />)
}
