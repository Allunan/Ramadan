import generouted from "@generouted/react-router/plugin"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), generouted(), svgr()],
  resolve: { alias: { "@": "/src" } }
})
