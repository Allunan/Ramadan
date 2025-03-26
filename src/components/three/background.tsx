import { shaderMaterial, useTexture } from "@react-three/drei"
import { extend, useThree } from "@react-three/fiber"
import * as THREE from "three"
import fragmentShader from "./glsl/background/fragment.glsl"
import vertexShader from "./glsl/background/vertex.glsl"

const BackgroundShader = shaderMaterial(
  {
    uTime: 0,
    uTexture: null
  },
  vertexShader,
  fragmentShader
)

extend({ BackgroundShader })

// Add the missing type declaration for the extended JSX elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      backgroundShader: unknown
    }
  }
}

const Background = () => {
  const randTexture = useTexture("/textures/rand.png")

  randTexture.wrapS = THREE.RepeatWrapping
  randTexture.wrapT = THREE.RepeatWrapping
  const { camera, viewport } = useThree()
  const position = new THREE.Vector3(0, 0, -5)
  const { width, height } = viewport.getCurrentViewport(camera, position)
  return (
    <>
      <mesh position={position}>
        <planeGeometry args={[width, height]} />
        <backgroundShader
          uniforms-uTexture-value={randTexture}
          key={BackgroundShader.key}
          transparent
        />
      </mesh>
    </>
  )
}

export default Background
