import { AppContextProvider } from "@src/shell/state/ShellState.tsx"
import { LockScreen } from "@src/shell/ui/LockScreen/LockScreen.tsx"
import { ShellScreen } from "@src/shell/ui/ShellScreen/ShellScreen.tsx"
import React from "react"

import "./App.css"

function App() {
  return (
    <AppContextProvider>
      <ShellScreen />
      <LockScreen />
    </AppContextProvider>
  )
}

export default App
