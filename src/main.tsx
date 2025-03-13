import "@/styles/globals.css"

import { Routes } from "@generouted/react-router"
import { ThemeProvider } from "next-themes"
import { createRoot } from "react-dom/client"
import { StrictMode } from "react"
import { ReactLenis, useLenis } from "lenis/react"

const container = document.getElementById("root")!

interface Props {
  className?: string
  children: React.ReactNode
}

const App: React.FC = () => {
  const lenis = useLenis(() => {})

  return (
    <StrictMode>
      <ReactLenis root>
        <ThemeProvider enableSystem={false} defaultTheme="light">
          <Routes />
        </ThemeProvider>
      </ReactLenis>
    </StrictMode>
  )
}

createRoot(container).render(<App />)
