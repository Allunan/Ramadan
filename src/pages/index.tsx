import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
import { useEffect, useRef } from "react"

gsap.registerPlugin(ScrollTrigger)
const Index: React.FC = () => {
  const dummy = useRef<HTMLDivElement>(null)
  useEffect(() => {
    window.scrollTo(0, 0) // Reset scroll on mount if needed
    gsap.to(dummy.current, {
      scrollTrigger: {
        trigger: dummy.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        markers: true,
        onEnter: () => {
          console.log("Enter")
        },
        onUpdate: (self) => {
          console.log(self.progress.toFixed(2))
        }
      }
    })
  }, [])
  return (
    <section className="min-h-screen">
      {/* <ThreeScene /> */}
      <div ref={dummy} className="h-[600vh] w-full relative">
        <div className="sticky top-0 left-0 w-full h-screen bg-purple-300 opacity-25 z-10" />
      </div>
      <div className="h-screen w-full bg-red-300">Footer</div>
    </section>
  )
}

export default Index
