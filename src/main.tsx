import "@/styles/globals.css"

import Index from "@/pages"
import { ReactLenis, useLenis } from "lenis/react"
import { ThemeProvider } from "next-themes"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

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
          <Index />
        </ThemeProvider>
      </ReactLenis>
    </StrictMode>
  )
}

createRoot(container).render(<App />)
