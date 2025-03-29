import { useGSAP } from "@gsap/react"
import { useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import gsap from "gsap"
import { useMemo } from "react"
import * as THREE from "three"
import fragmentShader from "../../glsl/particles/fragment.glsl"
import vertexShader from "../../glsl/particles/vertex.glsl"
interface Part1Props {
  container: React.RefObject<HTMLDivElement>
}

const Part1 = ({ container }: Part1Props) => {
  const attackTexture = useTexture("/textures/chapter-2/attack.png")
  const runningTexture = useTexture("/textures/chapter-2/runing1.png")
  const mountain1Texture = useTexture("/textures/chapter-2/monting1.png")
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
          uOutProgress: { value: 0 }
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
          uOutProgress: { value: 0 }
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
          uOutProgress: { value: 0 }
        },
        depthTest: false,
        depthWrite: false,
        transparent: true
      }),
    []
  )

  useFrame((state, delta) => {
    materialParticles.uniforms.uTime.value = state.clock.elapsedTime
    materialParticles2.uniforms.uTime.value = state.clock.elapsedTime
    materialParticles3.uniforms.uTime.value = state.clock.elapsedTime
  })

  // Set up animation timeline
  useGSAP(() => {
    if (container.current) {
      const tlIn = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "11% top",
          end: "20% top",
          toggleActions: "play none none reverse"
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
            ease: "power2.inOut"
          },
          "<"
        )

      const tlOut = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "20% top",
          end: "21% top",
          toggleActions: "play none none reverse"
        }
      })

      tlOut
        .to(
          materialParticles.uniforms.uOutProgress,
          { value: 1, duration: 1, ease: "power2.inOut" },
          "<"
        )
        .to(
          materialParticles2.uniforms.uOutProgress,
          { value: 1, duration: 1, ease: "power2.inOut" },
          "<"
        )
        .to(
          materialParticles3.uniforms.uOutProgress,
          { value: 1, duration: 1, ease: "power2.inOut" },
          "<"
        )
    }
  }, [container])

  return (
    <group position={[-0.2, 0, -0.5]}>
      <>
        <points
          scale={[
            (0.005 * runningTexture.image.width) / runningTexture.image.height,
            0.005,
            0.0
          ]}
          geometry={runningGeometry}
          material={materialParticles}
          position={[0, -0.5, -1.5]}
        />
        <points
          scale={[
            (0.005 * attackTexture.image.width) / attackTexture.image.height,
            0.005,
            0.0
          ]}
          geometry={attackGeometry}
          material={materialParticles2}
          position={[0.4, 0.4, -5]}
        />
        <points
          geometry={attackGeometry}
          scale={[
            (0.005 * attackTexture.image.width) / attackTexture.image.height,
            0.005,
            0.0
          ]}
          material={materialParticles3}
          position={[0.4, 0.3, -5.1]}
        />
      </>
    </group>
  )
}

export default Part1
