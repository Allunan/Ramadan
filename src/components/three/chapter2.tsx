import { useGSAP } from "@gsap/react"
import { useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import gsap from "gsap"
import { useMemo, useState } from "react"
import * as THREE from "three"
import fragmentShader from "./glsl/particles/fragment.glsl"
import vertexShader from "./glsl/particles/vertex.glsl"

const Chapter2 = ({
  container
}: {
  container: React.RefObject<HTMLDivElement>
}) => {
  const [displayParticles, setDisplayParticles] = useState(true)
  const [showParte1, setShowParte1] = useState(true)
  const [showParte2, setShowParte2] = useState(false)
  const [showParte3, setShowParte3] = useState(false)

  const attackTexture = useTexture("/textures/chapter-2/attack.png")
  const runningTexture = useTexture("/textures/chapter-2/runing1.png")
  const texture2 = useTexture("/textures/chapter-2/men-camel.png")
  const mountain1Texture = useTexture("/textures/chapter-2/monting1.png")
  const texture4 = useTexture("/textures/chapter-2/negociation2.png")
  const texture5 = useTexture("/textures/chapter-2/palm.png")
  const texture6 = useTexture("/textures/chapter-2/birds.png")

  const multiplier = 18
  const nbLines = 18 * multiplier
  const nbColumns = 18 * multiplier

  const createGeometry = (texture: THREE.Texture) => {
    const geometry = new THREE.BufferGeometry()
    const ratio = texture.image.width / texture.image.height

    const vertices = []
    for (let i = 0; i < nbLines; i++) {
      for (let j = 0; j < nbColumns; j++) {
        vertices.push(...[i, j, 0])
      }
    }
    const positions = new Float32Array(vertices)
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.center()
    return geometry
  }
  const runningGeometry = useMemo(() => createGeometry(runningTexture), [])
  const attackGeometry = useMemo(() => createGeometry(attackTexture), [])

  const materialParticles = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
          uTexture: { value: runningTexture },
          uSize: { value: 0.02 },
          uResolution: {
            value: new THREE.Vector2(window.innerWidth, window.innerHeight)
          },
          uTime: { value: 0 },
          uImageSize: {
            value: new THREE.Vector2(
              runningTexture.image.width,
              runningTexture.image.height
            )
          },
          uNbLines: { value: nbLines },
          uNbColumns: { value: nbColumns },
          uInProgress: { value: 0 },
          uFadeProgress: { value: 0 }
        },
        depthTest: false,
        depthWrite: false,
        transparent: true
      }),
    []
  )

  const materialParticles2 = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
          uTexture: { value: attackTexture },
          uSize: { value: 0.035 },
          uResolution: {
            value: new THREE.Vector2(window.innerWidth, window.innerHeight)
          },
          uTime: { value: 0 },
          uImageSize: {
            value: new THREE.Vector2(
              attackTexture.image.width,
              attackTexture.image.height
            )
          },
          uInProgress: { value: 0 },
          uFadeProgress: { value: 0 }
        },
        depthTest: false,
        depthWrite: false,
        transparent: true
      }),
    []
  )
  const materialParticles3 = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
          uTexture: { value: mountain1Texture },
          uSize: { value: 0.035 },
          uResolution: {
            value: new THREE.Vector2(window.innerWidth, window.innerHeight)
          },
          uTime: { value: 0 },
          uImageSize: {
            value: new THREE.Vector2(
              mountain1Texture.image.width,
              mountain1Texture.image.height
            )
          },
          uInProgress: { value: 0 },
          uFadeProgress: { value: 0 }
        },
        depthTest: false,
        depthWrite: false,
        transparent: true
      }),
    []
  )

  useGSAP(() => {
    setDisplayParticles(true)
  })

  useFrame((state, delta) => {
    materialParticles.uniforms.uTime.value = state.clock.elapsedTime
    materialParticles2.uniforms.uTime.value = state.clock.elapsedTime
    materialParticles3.uniforms.uTime.value = state.clock.elapsedTime
  })

  const material2 = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: texture2,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        side: THREE.DoubleSide
      }),
    []
  )
  const material4 = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: texture4,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        side: THREE.DoubleSide
      }),
    []
  )
  const material5 = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: texture5,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        side: THREE.DoubleSide
      }),
    []
  )
  const material6 = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: texture6,
        transparent: true,
        depthTest: false,
        depthWrite: false
      }),
    []
  )

  useGSAP(() => {
    const tlIn = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "11% top",
        end: "20% top",
        markers: true,
        toggleActions: "play none reverse none",
        scrub: 1,
        onEnter: () => {
          console.log("enter")
        },
        onEnterBack: () => {
          console.log("enter back")
        }
      }
    })

    tlIn
      .to(
        materialParticles.uniforms.uInProgress,
        {
          value: 1,
          duration: 1,
          ease: "power2.inOut"
        },
        "<"
      )
      .to(
        materialParticles2.uniforms.uInProgress,
        {
          value: 1,
          duration: 1,
          ease: "power2.inOut"
        },
        "<"
      )
      .to(
        materialParticles3.uniforms.uInProgress,
        {
          value: 1,
          duration: 1,
          ease: "power2.inOut",
          onComplete: () => {
            // setDisplayParticles(false)
          }
        },
        "<"
      )
  })

  return (
    <group position={[0, 0, 0.35]}>
      {/* attack */}
      {showParte1 && (
        <group position={[-0.2, 0, -0.5]}>
          {displayParticles ? (
            <>
              <points
                scale={0.005}
                geometry={runningGeometry}
                material={materialParticles}
                position={[0, -0.5, -1.5]}
              />
              <points
                scale={0.007}
                geometry={attackGeometry}
                material={materialParticles2}
                position={[0.4, 0.3, -5]}
              />
              <points
                geometry={attackGeometry}
                scale={0.009}
                material={materialParticles3}
                position={[0.4, 0.3, -5.1]}
              />
            </>
          ) : (
            <>
              <mesh
                geometry={attackGeometry}
                material={materialParticles}
                position={[-0.4, -0.5, -1.5]}
              />
              <mesh
                geometry={attackGeometry}
                material={materialParticles2}
                position={[0.4, 0.4, -5]}
              />
              <mesh
                geometry={attackGeometry}
                material={materialParticles3}
                position={[0.4, 0.3, -5.1]}
              />
            </>
          )}
        </group>
      )}

      {/* negociating */}
      <group position={[0, 0, 0]}>
        {showParte2 && (
          <mesh
            geometry={attackGeometry}
            material={material2}
            position={[0.2, 0, -2]}
          />
        )}
        {showParte3 && (
          <group position={[-0.2, 0, 0]}>
            <mesh
              geometry={attackGeometry}
              material={material6}
              position={[1.2, 0.7, -4]}
            />
            <mesh
              geometry={attackGeometry}
              material={material4}
              position={[0.2, 0, -1]}
            />

            <mesh
              geometry={attackGeometry}
              material={material5}
              position={[-0.8, 0, -0.8]}
            />
          </group>
        )}
      </group>
    </group>
  )
}

export default Chapter2
