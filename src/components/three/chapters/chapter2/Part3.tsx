import { useGSAP } from "@gsap/react"
import { useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import gsap from "gsap"
import { useMemo } from "react"
import * as THREE from "three"
import fragmentShader from "../../glsl/particles/fragment.glsl"
import vertexShader from "../../glsl/particles/vertex.glsl"
interface Part3Props {
  container: React.RefObject<HTMLDivElement>
}

const Part3 = ({ container }: Part3Props) => {
  const negotiationTexture = useTexture("/textures/chapter-2/negociation2.png")
  const palmTexture = useTexture("/textures/chapter-2/palm.png")
  const birdsTexture = useTexture("/textures/chapter-2/birds.png")

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

  const negotiationGeometry = useMemo(
    () => createGeometry(negotiationTexture),
    []
  )
  const palmGeometry = useMemo(() => createGeometry(palmTexture), [])
  const birdsGeometry = useMemo(() => createGeometry(birdsTexture), [])

  const negotiationMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
          uTexture: { value: negotiationTexture },
          uSize: { value: 0.028 },
          uResolution: {
            value: new THREE.Vector2(window.innerWidth, window.innerHeight)
          },
          uTime: { value: 0 },
          uImageSize: {
            value: new THREE.Vector2(
              negotiationTexture.image.width,
              negotiationTexture.image.height
            )
          },
          uInProgress: { value: 0 },
          uOutProgress: { value: 0 },
          uNbLines: { value: nbLines },
          uNbColumns: { value: nbColumns }
        },
        depthTest: false,
        depthWrite: false,
        transparent: true
      }),
    []
  )

  const palmMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
          uTexture: { value: palmTexture },
          uSize: { value: 0.02 },
          uResolution: {
            value: new THREE.Vector2(window.innerWidth, window.innerHeight)
          },
          uTime: { value: 0 },
          uImageSize: {
            value: new THREE.Vector2(
              palmTexture.image.width,
              palmTexture.image.height
            )
          },
          uInProgress: { value: 0 },
          uOutProgress: { value: 0 },
          uNbLines: { value: nbLines },
          uNbColumns: { value: nbColumns }
        },
        depthTest: false,
        depthWrite: false,
        transparent: true
      }),
    []
  )

  const birdsMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
          uTexture: { value: birdsTexture },
          uSize: { value: 0.01 },
          uResolution: {
            value: new THREE.Vector2(window.innerWidth, window.innerHeight)
          },
          uTime: { value: 0 },
          uImageSize: {
            value: new THREE.Vector2(
              birdsTexture.image.width,
              birdsTexture.image.height
            )
          },
          uInProgress: { value: 0 },
          uOutProgress: { value: 0 },
          uNbLines: { value: nbLines },
          uNbColumns: { value: nbColumns }
        },
        depthTest: false,
        depthWrite: false,
        transparent: true
      }),
    []
  )

  // Update the time uniforms
  useFrame((state) => {
    negotiationMaterial.uniforms.uTime.value = state.clock.elapsedTime
    palmMaterial.uniforms.uTime.value = state.clock.elapsedTime
    birdsMaterial.uniforms.uTime.value = state.clock.elapsedTime
  })

  // Set up animation timeline
  useGSAP(() => {
    if (container.current) {
      const tlIn = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "31% top",
          end: "40% top",
          markers: true,
          toggleActions: "play none none reverse"
        }
      })

      tlIn
        .to(
          negotiationMaterial.uniforms.uInProgress,
          {
            value: 1,
            duration: 1,
            ease: "power2.inOut"
          },
          "<"
        )
        .to(
          palmMaterial.uniforms.uInProgress,
          {
            value: 1,
            duration: 1,
            ease: "power2.inOut"
          },
          "<"
        )
        .to(
          birdsMaterial.uniforms.uInProgress,
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
          start: "40% top",
          end: "41% top",
          markers: true,
          toggleActions: "play none none reverse"
        }
      })

      tlOut
        .to(
          negotiationMaterial.uniforms.uOutProgress,
          { value: 1, duration: 1, ease: "power2.inOut" },
          "<"
        )
        .to(
          palmMaterial.uniforms.uOutProgress,
          { value: 1, duration: 1, ease: "power2.inOut" },
          "<"
        )
        .to(
          birdsMaterial.uniforms.uOutProgress,
          { value: 1, duration: 1, ease: "power2.inOut" },
          "<"
        )
    }
  }, [container])

  return (
    <group position={[-0.2, 0, 0]}>
      <points
        scale={[
          (0.002 * birdsTexture.image.width) / birdsTexture.image.height,
          0.002,
          0.0
        ]}
        geometry={birdsGeometry}
        material={birdsMaterial}
        position={[1, 0.7, 0]}
      />
      <points
        scale={[
          (0.01 * negotiationTexture.image.width) /
            negotiationTexture.image.height,
          0.007,
          0.0
        ]}
        geometry={negotiationGeometry}
        material={negotiationMaterial}
        position={[0.2, 0.2, -1]}
      />
      <points
        scale={[
          (0.005 * palmTexture.image.width) / palmTexture.image.height,
          0.005,
          0.0
        ]}
        geometry={palmGeometry}
        material={palmMaterial}
        position={[-0.8, 0, -0.8]}
      />
    </group>
  )
}

export default Part3
