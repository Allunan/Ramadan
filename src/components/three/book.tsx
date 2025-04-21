import { useGSAP } from "@gsap/react"
import { OrbitControls, useTexture } from "@react-three/drei"
import gsap from "gsap"
import { useRef } from "react"
import * as THREE from "three"

interface BookProps {
  container: React.RefObject<HTMLDivElement>
}

const Book = ({ container }: BookProps) => {
  // Load textures
  const texture = useTexture("textures/book/texture.png")
  const aoMap = useTexture("textures/book/ao.png")
  const normalMap = useTexture("textures/book/normal.png")
  const heightMap = useTexture("textures/book/height.png")
  const metalnessMap = useTexture("textures/book/metalness.png")
  const roughnessMap = useTexture("textures/book/roughness.png")

  // Refs for different parts of the book
  const bookGroupRef = useRef<THREE.Group>(null)
  const frontCoverRef = useRef<THREE.Group>(null)
  const backCoverRef = useRef<THREE.Mesh>(null)
  const rightEdgeRef = useRef<THREE.Mesh>(null)

  // Book dimensions
  const bookWidth = 0.5
  const bookHeight = 0.5
  const bookThickness = 0.01 // Thickness of the book cover

  useGSAP(() => {
    gsap.to(frontCoverRef.current.rotation, {
      y: -Math.PI,
      duration: 1,
      ease: "power2.inOut"
    })
    gsap.to(frontCoverRef.current.position, {
      x: frontCoverRef.current.position.x + 0.01,
      duration: 1,
      ease: "power2.inOut"
    })
  })

  const rightEdgeWidth = bookThickness * 0.2

  return (
    <group ref={bookGroupRef} position={[0, 0, 0.35]}>
      {/* Front Cover */}
      <OrbitControls />
      <group
        ref={frontCoverRef}
        position={[-bookWidth / 2, 0, bookThickness / 2]}>
        <mesh position={[bookWidth / 2, 0, bookThickness / 2]}>
          <boxGeometry args={[bookWidth, bookHeight, bookThickness / 2]} />
          <meshStandardMaterial
            map={texture}
            aoMap={aoMap}
            aoMapIntensity={2}
            bumpMap={heightMap}
            normalMap={normalMap}
            metalnessMap={metalnessMap}
            roughnessMap={roughnessMap}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Back Cover */}
      <mesh ref={backCoverRef} position={[0, 0, -bookThickness / 2]}>
        <boxGeometry args={[bookWidth, bookHeight, bookThickness / 2]} />
        <meshStandardMaterial
          map={texture}
          aoMap={aoMap}
          aoMapIntensity={2}
          bumpMap={heightMap}
          normalMap={normalMap}
          metalnessMap={metalnessMap}
          roughnessMap={roughnessMap}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Lighting */}
      <directionalLight position={[0, 0, 1]} intensity={2} />
      <directionalLight position={[0, 0, -1]} intensity={1} />
      <directionalLight position={[1, 0, 0]} intensity={1} />
      <directionalLight position={[-1, 0, 0]} intensity={1} />
      {/* <OrbitControls /> */}
    </group>
  )
}

export default Book
