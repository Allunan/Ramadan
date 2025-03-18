import { OrbitControls, useTexture } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { useControls } from "leva"
import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"

// Dynamic shader imports for hot reloading
// The ?raw suffix tells Vite to import these as strings and enables HMR
import fragmentShaderSource from "../three/glsl/images/fragment.glsl?raw"
import vertexShaderSource from "../three/glsl/images/vertex.glsl?raw"

export const ThreeScene: React.FC = () => {
  // Define Leva controls here at the top level
  const { showControls } = useControls({
    showControls: {
      value: true,
      label: "Show Controls"
    }
  })

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }}>
        <color attach="background" args={["#050505"]} />
        <OrbitControls />
        <ambientLight intensity={1} />
        <TexturedParticles
          customImage={"/test.png"}
          showControls={showControls}
        />
        {/* <Curve /> */}
      </Canvas>
    </div>
  )
}

// Define an interface for our controls
interface ShaderControls {
  progress: number
  fadeProgress: number
}

const TexturedParticles: React.FC<{
  customImage: string
  showControls: boolean
}> = ({ customImage, showControls }) => {
  // State for shader sources to enable hot reloading
  const [vertexShader, setVertexShader] = useState(vertexShaderSource)
  const [fragmentShader, setFragmentShader] = useState(fragmentShaderSource)
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null)

  // Store the last update time to throttle shader updates
  const lastUpdateTimeRef = useRef(0)
  const lastControlUpdateTimeRef = useRef(0)

  // Create a texture once
  const texture = useTexture(customImage)
  const ratio = window.innerWidth / window.innerHeight

  // Create resolution vector once
  const resolution = useMemo(() => {
    return new THREE.Vector2(window.innerWidth, window.innerHeight)
  }, [])

  // Create image size vector once
  const imageSize = useMemo(() => {
    return new THREE.Vector2(texture.image.width, texture.image.height)
  }, [texture])

  // Create refs to store the current control values
  const progressRef = useRef<number>(0)
  const fadeProgressRef = useRef<number>(0)

  // Type for our Leva controls
  type ControlsType = {
    progress: number
    fadeProgress: number
    [key: string]: any
  }

  // Leva controls
  const controls = useControls({
    progress: {
      value: 0,
      min: 0,
      max: 1,
      step: 0.01,
      label: "Progress",
      onChange: (value) => {
        progressRef.current = value
      }
    },
    fadeProgress: {
      value: 0,
      min: 0,
      max: 1,
      step: 0.01,
      label: "Burn Effect",
      onChange: (value) => {
        fadeProgressRef.current = value
      }
    }
  }) as ControlsType

  // Initialize our refs from the initial control values
  useEffect(() => {
    // Set initial values from controls
    progressRef.current = controls.progress
    fadeProgressRef.current = controls.fadeProgress
  }, [])

  // Set up hot module replacement for shaders
  useEffect(() => {
    // This effect will run when the imported shader modules change
    setVertexShader(vertexShaderSource)
    setFragmentShader(fragmentShaderSource)

    // Optional: Log when shaders are reloaded
    console.log("Shaders reloaded")
  }, [vertexShaderSource, fragmentShaderSource])

  // Pre-create the uniforms object to avoid recreating it on each render
  const uniforms = useMemo(() => {
    return {
      uTexture: { value: texture },
      uSize: { value: 0.01 },
      uResolution: { value: resolution },
      uTime: { value: 0 },
      uImageSize: { value: imageSize },
      uProgress: { value: 0 },
      uFadeProgress: { value: 0 }
    }
  }, [texture, resolution, imageSize])

  // Update shader uniforms only when necessary and with throttling
  useFrame((state) => {
    const currentTime = state.clock.getElapsedTime()

    // Update time uniform at 30fps
    if (currentTime - lastUpdateTimeRef.current > 0.033) {
      if (shaderMaterialRef.current) {
        shaderMaterialRef.current.uniforms.uTime.value = currentTime
      }
      lastUpdateTimeRef.current = currentTime
    }

    // Update control values less frequently to avoid freezing
    if (currentTime - lastControlUpdateTimeRef.current > 0.1) {
      if (shaderMaterialRef.current) {
        // Only update if values have changed
        shaderMaterialRef.current.uniforms.uProgress.value = progressRef.current
        shaderMaterialRef.current.uniforms.uFadeProgress.value =
          fadeProgressRef.current
      }
      lastControlUpdateTimeRef.current = currentTime
    }
  })

  return (
    <points>
      <planeGeometry args={[2 * ratio, 2, ratio * 300, 300]} />{" "}
      {/* Reduced resolution for better performance */}
      <shaderMaterial
        ref={shaderMaterialRef}
        key={`${vertexShader.length}-${fragmentShader.length}`} // Force re-creation when shaders change
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        transparent
        uniforms={uniforms}
      />
    </points>
  )
}

const Curve: React.FC = () => {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-5, 0, 0),
    new THREE.Vector3(0, 0, 5),
    new THREE.Vector3(5, 0, 0)
  ])

  const points = curve.getPoints(100)
  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  useFrame((state) => {
    const camera = state.camera
    const progress = Math.sin(state.clock.elapsedTime) * 0.5 + 0.5
    const point = curve.getPoint(progress)
    // camera.position.set(point.x, point.y, point.z)
    // camera.lookAt(curve.getPoint(progress + 0.01))
  })
  return (
    <group>
      <axesHelper args={[4]} />
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={geometry.getAttribute("position").array}
            count={geometry.getAttribute("position").count}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="red" />
      </lineSegments>
    </group>
  )
}
