import { ThreeScene } from "@/components"
import { useEffect } from "react"
const Index: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0) // Reset scroll on mount if needed
  }, [])
  return (
    <section className="min-h-screen">
      <ThreeScene />
    </section>
  )
}

export default Index
