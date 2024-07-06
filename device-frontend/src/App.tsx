import { CssBaseline, ThemeProvider } from "@mui/material"
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles"
import { DefaultObjectStore, EntityStateContextProvider } from "@src/infrastructure/framework/entities"
import { ShellScreen } from "@src/shell/ui/ShellScreen/ShellScreen.tsx"
import React from "react"

import "./App.css"
import { cssVarsTheme, theme } from "./Theme"


const objectStore = new DefaultObjectStore()

function App() {
  return (
    <>
      <EntityStateContextProvider store={objectStore}>
        <CssVarsProvider theme={cssVarsTheme}>
          <CssBaseline />
          <ShellScreen />
        </CssVarsProvider>
      </EntityStateContextProvider>
    </>
  )
}

export default App
