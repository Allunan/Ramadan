import { ThreeScene } from "@/components"
import { gsap } from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { useRef } from "react"
gsap.registerPlugin(ScrollTrigger)

const Index: React.FC = () => {
  const container = useRef<HTMLDivElement>(null)

  return (
    <section className="">
      <div ref={container} className="h-[1000vh] w-full relative">
        <div className="sticky top-0 left-0 w-full h-screen">
          <ThreeScene container={container} />
        </div>
      </div>
      <div className="h-screen w-full bg-red-300">Footer</div>
    </section>
  )
}

export default Index
