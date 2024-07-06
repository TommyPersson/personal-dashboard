import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig, loadEnv } from "vite"
import checker from "vite-plugin-checker"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    resolve: {
      alias: {
        '@src': path.resolve(__dirname, './src')
      },
    },
    build: {
      assetsDir: `assets/${env.VERSION ?? "0.1.0"}/`
    },
    plugins: [
      react(),
      checker({
        typescript: true,
      })
    ],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          ws: true,
        }
      }
    }
  }
})
