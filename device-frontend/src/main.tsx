import { CssBaseline } from "@mui/material"
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles"
import { DefaultObjectStore, EntityStateContextProvider } from "@src/infrastructure/framework/entities"
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"

import { cssVarsTheme } from "./Theme"


const objectStore = new DefaultObjectStore()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <EntityStateContextProvider store={objectStore}>
      <CssVarsProvider theme={cssVarsTheme}>
        <CssBaseline />
        <App />
      </CssVarsProvider>
    </EntityStateContextProvider>
  </React.StrictMode>,
)
