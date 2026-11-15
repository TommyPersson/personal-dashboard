import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vitest/config"

// Kept apart from vite.config.ts so tests don't run its type checker plugin or dev server proxy.
export default defineConfig({
  resolve: {
    alias: {
      "@src": path.resolve(import.meta.dirname, "./src"),
    },
  },
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: [".storybook/vitest.setup.ts"],
  },
})
