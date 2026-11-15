import "@testing-library/jest-dom/vitest"

import { setProjectAnnotations } from "@storybook/react-vite"
import { cleanup } from "@testing-library/react"
import { Settings } from "luxon"
import { afterEach } from "vitest"

import preview from "./preview.tsx"

// Stories render with the same decorators (theme, entity store) as in Storybook.
setProjectAnnotations(preview)

// The device's time zone, so formatted times don't depend on the machine running the tests.
Settings.defaultZone = "Europe/Stockholm"

afterEach(() => {
  cleanup()
})
