import { CssBaseline } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"
import { DefaultObjectStore, EntityStateContextProvider } from "@src/infrastructure/framework/entities"
import { createQueryClient } from "@src/infrastructure/framework/query/queryClient.ts"
import { QueryClientProvider } from "@tanstack/react-query"
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"

import { theme } from "./Theme"


const objectStore = new DefaultObjectStore()
const queryClient = createQueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <EntityStateContextProvider store={objectStore}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </EntityStateContextProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
