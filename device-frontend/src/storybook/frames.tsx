import { AppContext, AppContextValue } from "@src/shell/state/ShellState.tsx"
import { LockScreenView } from "@src/shell/ui/LockScreen/LockScreen.tsx"
import type { Decorator } from "@storybook/react-vite"
import React, { useEffect, useState } from "react"

import shellClasses from "@src/shell/ui/ShellScreen/ShellScreen.module.scss"

/**
 * Frames that recreate the parts of the shell that widgets portal into (lock screen columns, app bar, app area
 * overlay). `DynamicPortal` looks up its target during render, so the story is only mounted once the frame's
 * target elements exist in the DOM.
 */

const MountAfterFrame = (props: { children: React.ReactNode }) => {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  return isReady ? props.children : null
}

const mockAppContext: AppContextValue = {
  isUnlocked: false,
  isServerReachable: true,
  lock: () => {
  },
  unlock: () => {
  },
  unlockInProgress: false,
  unlockError: null,
}

/** Renders the story inside the real lock screen layout (widget columns 1 & 2, icon bar, pin pad). */
export const withLockScreen: Decorator = (Story) => (
  <AppContext.Provider value={mockAppContext}>
    <LockScreenView />
    <MountAfterFrame>
      <Story />
    </MountAfterFrame>
  </AppContext.Provider>
)

/** Renders the story into the vertical app bar on the right side of the shell. */
export const withAppBar: Decorator = (Story) => (
  <div style={{ display: "flex", justifyContent: "flex-end", height: "100vh", background: "#fafafa" }}>
    <div className={shellClasses.AppBarSlot}>
      <div id={"appBarPortal"} className={shellClasses.AppBarPortal} />
    </div>
    <MountAfterFrame>
      <Story />
    </MountAfterFrame>
  </div>
)

/** Renders the story into the overlay area above the apps (media player, notification toasts). */
export const withAppArea: Decorator = (Story) => (
  <div style={{ position: "relative", height: "100vh", background: "#fafafa" }}>
    <div id={"appAreaPortal"} style={{ position: "absolute", inset: 0 }} />
    <MountAfterFrame>
      <Story />
    </MountAfterFrame>
  </div>
)

/** Gives an app widget the full-height slot it gets in the horizontal app area. */
export const withAppSlot: Decorator = (Story) => (
  <div style={{ display: "flex", alignItems: "stretch", height: "100vh", background: "#fafafa" }}>
    <Story />
  </div>
)
