import { OrbitControls, shaderMaterial, useTexture } from "@react-three/drei"
import { Canvas, extend, useFrame } from "@react-three/fiber"
import gsap from "gsap"
import { button, useControls } from "leva"
import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"

// Dynamic shader imports for hot reloading
// The ?raw suffix tells Vite to import these as strings and enables HMR
import Background from "@/components/three/background"
import Chapter1 from "@/components/three/chapter1"
import Foreground from "@/components/three/foreground"
import fragmentShaderSource from "../three/glsl/images/fragment.glsl?raw"
import vertexShaderSource from "../three/glsl/images/vertex.glsl?raw"

// Declare the material with proper types
const ParticlesMaterial = shaderMaterial(
  {
    uTexture: new THREE.Texture(),
    uSize: 0.01,
    uResolution: new THREE.Vector2(1, 1),
    uTime: 0,
    uImageSize: new THREE.Vector2(1, 1),
    uProgress: 0,
    uFadeProgress: 0
  },
  vertexShaderSource,
  fragmentShaderSource
)

// Extend THREE with our custom material
extend({ ParticlesMaterial })

// Add the missing type declaration for the extended JSX elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      particlesMaterial: unknown
    }
  }
}

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
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 2], fov: 35 }}>
        <color attach="background" args={["#050505"]} />
        <OrbitControls />
        <ambientLight intensity={1} />
        {/* <TexturedParticles
          customImage={"/test.png"}
          showControls={showControls}
        /> */}
        <Foreground />
        <Background />
        <Chapter1 />
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
    if (texture?.image) {
      return new THREE.Vector2(texture.image.width, texture.image.height)
    }
    return new THREE.Vector2(1, 1)
  }, [texture])

  // Create refs to store the current control values
  const progressRef = useRef<number>(0)
  const fadeProgressRef = useRef<number>(0)

  // Type for our Leva controls
  type ControlsType = {
    progress: number
    fadeProgress: number
    [key: string]: unknown
  }

  // Leva controls
  const controls = useControls({
    progress: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01,
      label: "Progress",
      onChange: (value) => {
        progressRef.current = value
      }
    },
    fadeProgress: {
      value: 0.1,
      min: 0,
      max: 1,
      step: 0.01,
      label: "Burn Effect",
      onChange: (value) => {
        fadeProgressRef.current = value
      }
    },
    "Animate In": button(() => {
      if (shaderMaterialRef.current) {
        gsap.to(progressRef, {
          current: 1,
          duration: 2,
          ease: "power2.inOut",
          onUpdate: () => {
            // Update the Leva control UI
            if (controls && typeof controls.progress !== "undefined") {
              controls.progress = progressRef.current
            }
          }
        })
      }
    }),
    "Burn Effect": button(() => {
      if (shaderMaterialRef.current) {
        gsap.to(fadeProgressRef, {
          current: 1,
          duration: 2,
          ease: "power2.inOut",
          onUpdate: () => {
            // Update the Leva control UI
            if (controls && typeof controls.fadeProgress !== "undefined") {
              controls.fadeProgress = fadeProgressRef.current
            }
          }
        })
      }
    })
  }) as ControlsType

  // Initialize our refs from the initial control values
  useEffect(() => {
    // Set initial values from controls
    if (controls) {
      progressRef.current = controls.progress || 0
      fadeProgressRef.current = controls.fadeProgress || 0
    }
  }, [controls])

  // Initialize the shader material with default values
  useEffect(() => {
    if (shaderMaterialRef.current && texture) {
      // Initialize all uniforms with safe values
      shaderMaterialRef.current.uniforms = {
        uTexture: { value: texture },
        uSize: { value: 0.01 },
        uResolution: { value: resolution },
        uTime: { value: 0 },
        uImageSize: { value: imageSize },
        uProgress: { value: progressRef.current },
        uFadeProgress: { value: fadeProgressRef.current }
      }
    }
  }, [texture, resolution, imageSize])

  // Update shader uniforms only when necessary and with throttling
  useFrame((state) => {
    const currentTime = state.clock.getElapsedTime()

    // Update time uniform at 30fps
    if (currentTime - lastUpdateTimeRef.current > 0.033) {
      if (shaderMaterialRef.current?.uniforms) {
        shaderMaterialRef.current.uniforms.uTime.value = currentTime
      }
      lastUpdateTimeRef.current = currentTime
    }

    // Update control values less frequently to avoid freezing
    if (currentTime - lastControlUpdateTimeRef.current > 0.1) {
      if (shaderMaterialRef.current?.uniforms) {
        // Only update if values have changed and refs exist
        shaderMaterialRef.current.uniforms.uProgress.value = progressRef.current
        shaderMaterialRef.current.uniforms.uFadeProgress.value =
          fadeProgressRef.current
      }
      lastControlUpdateTimeRef.current = currentTime
    }
  })

  return (
    <points>
      <planeGeometry args={[2 * ratio, 2, ratio * 300, 300]} />
      <particlesMaterial
        ref={shaderMaterialRef}
        transparent
        key={ParticlesMaterial.key}
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
