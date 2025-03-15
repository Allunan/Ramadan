import { OrbitControls, useTexture } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

// Dynamic shader imports for hot reloading
// The ?raw suffix tells Vite to import these as strings and enables HMR
import fragmentShaderSource from "../three/glsl/images/fragment.glsl?raw"
import vertexShaderSource from "../three/glsl/images/vertex.glsl?raw"

export const ThreeScene: React.FC = () => {
  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }}>
        <color attach="background" args={["#050505"]} />
        <ambientLight intensity={1} />
        <OrbitControls />
        <TexturedParticles customImage={"/test.png"} />
      </Canvas>
    </div>
  )
}

const TexturedParticles: React.FC<{ customImage: string }> = ({
  customImage
}) => {
  // State for shader sources to enable hot reloading
  const [vertexShader, setVertexShader] = useState(vertexShaderSource)
  const [fragmentShader, setFragmentShader] = useState(fragmentShaderSource)
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null)

  // Load texture
  const texture = useTexture(customImage)
  const ratio = window.innerWidth / window.innerHeight

  // Set up hot module replacement for shaders
  useEffect(() => {
    // This effect will run when the imported shader modules change
    setVertexShader(vertexShaderSource)
    setFragmentShader(fragmentShaderSource)

    // Optional: Log when shaders are reloaded
    console.log("Shaders reloaded")
  }, [vertexShaderSource, fragmentShaderSource])

  // Animation loop for time uniform
  useFrame((state) => {
    if (shaderMaterialRef.current) {
      shaderMaterialRef.current.uniforms.uTime.value =
        state.clock.getElapsedTime()
      shaderMaterialRef.current.uniforms.uProgress.value =
        Math.sin(state.clock.getElapsedTime()) * 0.5 + 0.5
    }
  })

  return (
    <points>
      <planeGeometry args={[2 * ratio, 2, ratio * 300, 300]} />
      <shaderMaterial
        ref={shaderMaterialRef}
        key={`${vertexShader.length}-${fragmentShader.length}`} // Force re-creation when shaders change
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        transparent
        uniforms={{
          uTexture: { value: texture },
          uSize: { value: 0.01 },
          uResolution: {
            value: new THREE.Vector2(window.innerWidth, window.innerHeight)
          },
          uTime: { value: 0 },
          uImageSize: {
            value: new THREE.Vector2(texture.image.width, texture.image.height)
          },
          uProgress: { value: 0 }
        }}
      />
    </points>
  )
}
