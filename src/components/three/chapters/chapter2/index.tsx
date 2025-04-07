import { useTexture } from "@react-three/drei"
import Part1 from "./Part1"
import Part2 from "./Part2"
import Part3 from "./Part3"

interface Chapter2Props {
  container: React.RefObject<HTMLDivElement>
}

const Chapter2 = ({ container }: Chapter2Props) => {
  const texture = useTexture("textures/book/texture.png")
  const aoMap = useTexture("textures/book/ao.png")
  const normalMap = useTexture("textures/book/normal.png")
  const heightMap = useTexture("textures/book/height.png")
  return (
    <group position={[0, 0, 0.35]}>
      <Part1 container={container} />
      <Part2 container={container} />
      <Part3 container={container} />
      {/* <mesh position={[0, 0, 1]} scale={1}>
        <planeGeometry args={[0.5, 0.5, 100, 100]} />
        <meshStandardMaterial
          map={texture}
          aoMap={aoMap}
          aoMapIntensity={2}
          bumpMap={heightMap}
          displacementMap={heightMap}
          displacementScale={0.04}
          normalMap={normalMap}
        />
      </mesh> */}
      <directionalLight position={[0, 0, 1]} intensity={2} />
    </group>
  )
}

export default Chapter2
