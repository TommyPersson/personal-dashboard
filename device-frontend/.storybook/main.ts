import type { StorybookConfig } from "@storybook/react-vite"
import { msw } from "msw/vite"

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "msw-storybook-addon"],
  framework: "@storybook/react-vite",
  // Serves the weather icons etc. the same way the Vite dev server does
  staticDirs: ["../public"],
  async viteFinal(config) {
    // The type checker overlay is noisy inside Storybook; `npm run build` still type checks stories.
    config.plugins = (config.plugins ?? []).flat().filter(it => {
      return !(it && typeof it === "object" && "name" in it && it.name === "vite-plugin-checker")
    })
    // Serves (and emits, for `build-storybook`) mockServiceWorker.js, so it never has to live in `public/` and
    // never ends up in the application build
    config.plugins.push(msw({ mode: "worker-only" }))
    // Keep Storybook self-contained: `/api` is answered by MSW (see src/storybook/msw.ts), never proxied to a
    // running backend
    if (config.server) {
      config.server.proxy = undefined
    }
    return config
  },
}

export default config
