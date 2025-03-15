import { ThreeScene } from "@/components"
import { gsap } from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { useEffect, useRef } from "react"
gsap.registerPlugin(ScrollTrigger)

const Index: React.FC = () => {
  const dummy = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0) // Reset scroll on mount if needed
    // gsap.to(dummy.current, {
    //   scrollTrigger: {
    //     trigger: dummy.current,
    //     start: "top top",
    //     end: "bottom bottom",
    //     scrub: true,
    //     markers: true,
    //     onEnter: () => {
    //       console.log("enter")
    //     },
    //     onUpdate: (e) => {
    //       console.log(e.progress.toFixed(2))
    //     }
    //   }
    // })
  }, [])

  return (
    <section className="">
      <ThreeScene />
      {/* <div ref={dummy} className="h-[600vh] w-full relative">
        <div className="fixed top-0 left-0 w-full h-screen bg-red-500 opacity-25" />
      </div> */}
    </section>
  )
}

export default Index
