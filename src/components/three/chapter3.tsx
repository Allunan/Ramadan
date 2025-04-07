import { useGSAP } from "@gsap/react"
import { useTexture } from "@react-three/drei"
import gsap from "gsap"
import { useMemo } from "react"
import * as THREE from "three"
import fragmentShader from "./glsl/sand/fragment.glsl"
import vertexShader from "./glsl/sand/vertex.glsl"

interface Chapter3Props {
  container: React.RefObject<HTMLDivElement>
}

const Chapter3 = ({ container }: Chapter3Props) => {
  const preparingTexture = useTexture("/textures/Chapter-3/preparing2.png")
  const palmTexture = useTexture("/textures/chapter-1/palm-tree1.png")
  const birdsTexture = useTexture("/textures/chapter-2/birds.png")

  const multiplier = 18
  const nbLines = 18 * multiplier
  const nbColumns = 18 * multiplier

  const createGeometry = (texture: THREE.Texture) => {
    const geometry = new THREE.BufferGeometry()
    const ratio = texture.image.width / texture.image.height

    const vertices = []
    const uvs = []
    for (let i = 0; i < nbLines; i++) {
      for (let j = 0; j < nbColumns; j++) {
        vertices.push(...[i, j, 0])
        uvs.push(...[i / nbLines, j / nbColumns])
      }
    }
    const positions = new Float32Array(vertices)
    const uvsArray = new Float32Array(uvs)
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvsArray, 2))
    geometry.center()
    return geometry
  }

  const preparingGeometry = useMemo(() => createGeometry(preparingTexture), [])
  const palmGeometry = useMemo(() => createGeometry(palmTexture), [])
  const birdsGeometry = useMemo(() => createGeometry(birdsTexture), [])

  const materialParticles = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
          uTexture: { value: preparingTexture },
          uSize: { value: 0.04 },
          uResolution: {
            value: new THREE.Vector2(window.innerWidth, window.innerHeight)
          },
          uTime: { value: 0 },
          uImageSize: {
            value: new THREE.Vector2(
              preparingTexture.image.width,
              preparingTexture.image.height
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

  const birdsMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
          uTexture: { value: birdsTexture },
          uSize: { value: 0.02 },
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

  // Set up animation timeline
  useGSAP(() => {
    if (container.current) {
      const tlIn = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "41% top",
          end: "50% top",
          toggleActions: "play none none reverse"
        }
      })

      tlIn
        .to(
          materialParticles.uniforms.uInProgress,
          {
            value: 1,
            duration: 2,
            ease: "power2.inOut"
          },
          "<"
        )
        .to(
          palmMaterial.uniforms.uInProgress,
          {
            value: 1,
            duration: 2,
            ease: "power2.inOut"
          },
          "<"
        )
        .to(
          birdsMaterial.uniforms.uInProgress,
          {
            value: 1,
            duration: 2,
            ease: "power2.inOut"
          },
          "<"
        )
      const tlOut = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "50% top",
          end: "51% top",
          markers: true,
          toggleActions: "play none none reverse"
        }
      })

      tlOut
        .to(
          materialParticles.uniforms.uOutProgress,
          { value: 1, duration: 3, ease: "power2.inOut" },
          "<"
        )
        .to(
          palmMaterial.uniforms.uOutProgress,
          { value: 1, duration: 3, ease: "power2.inOut" },
          ""
        )
        .to(
          birdsMaterial.uniforms.uOutProgress,
          { value: 1, duration: 3, ease: "power2.inOut" },
          ""
        )
    }
  }, [container])

  return (
    <group position={[0.4, 0, -1]}>
      <points
        scale={[
          (0.005 * birdsTexture.image.width) / birdsTexture.image.height,
          0.005,
          0.0
        ]}
        geometry={birdsGeometry}
        material={birdsMaterial}
        position={[0.8, 2, -5]}
      />
      <points
        scale={[
          (0.005 * palmTexture.image.width) / palmTexture.image.height,
          0.005,
          0.0
        ]}
        geometry={palmGeometry}
        material={palmMaterial}
        position={[0.5, 0.1, 1]}
      />
      <points
        scale={[
          (0.007 * preparingTexture.image.width) /
            preparingTexture.image.height,
          0.007,
          0.0
        ]}
        geometry={preparingGeometry}
        material={materialParticles}
        position={[0, 0, -1]}
      />
    </group>
  )
}

export default Chapter3
