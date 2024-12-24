import { AppContextProvider } from "@src/shell/state/ShellState.tsx"
import { ServerUnreachableIndicator } from "@src/shell/ui/ServerUnreachableIndicator/ServerUnreachableIndicator.tsx"
import { LockScreen } from "@src/shell/ui/LockScreen/LockScreen.tsx"
import { ShellScreen } from "@src/shell/ui/ShellScreen/ShellScreen.tsx"
import React from "react"

import "./App.css"

function App() {
  return (
    <AppContextProvider>
      <ServerUnreachableIndicator />
      <ShellScreen />
      <LockScreen />
    </AppContextProvider>
  )
}

export default App
