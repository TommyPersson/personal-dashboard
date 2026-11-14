import { CssBaseline } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"
import { DefaultObjectStore, EntityStateContextProvider } from "@src/infrastructure/framework/entities"
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"

import { theme } from "./Theme"


const objectStore = new DefaultObjectStore()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <EntityStateContextProvider store={objectStore}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </EntityStateContextProvider>
  </React.StrictMode>,
)
