import { CssBaseline } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"
import { createQueryClient } from "@src/infrastructure/framework/query/queryClient.ts"
import { QueryClientProvider } from "@tanstack/react-query"
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"

import { theme } from "./Theme"


const queryClient = createQueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
