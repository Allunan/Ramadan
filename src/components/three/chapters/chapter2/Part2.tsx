import { useGSAP } from "@gsap/react"
import { useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import gsap from "gsap"
import { useMemo } from "react"
import * as THREE from "three"
import fragmentShader from "../../glsl/particles/fragment.glsl"
import vertexShader from "../../glsl/particles/vertex.glsl"
interface Part2Props {
  container: React.RefObject<HTMLDivElement>
}

const Part2 = ({ container }: Part2Props) => {
  const manCamelTexture = useTexture("/textures/chapter-2/men-camel.png")

  const multiplier = 25
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

  const meshGeometry = useMemo(() => createGeometry(manCamelTexture), [])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
          uTexture: { value: manCamelTexture },
          uSize: { value: 0.029 },
          uResolution: {
            value: new THREE.Vector2(window.innerWidth, window.innerHeight)
          },
          uTime: { value: 0 },
          uImageSize: {
            value: new THREE.Vector2(
              manCamelTexture.image.width,
              manCamelTexture.image.height
            )
          },
          uInProgress: { value: 0 }, // Set to 1 to show immediately
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

  // Update the time uniform
  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
  })

  // Set up animation timeline
  useGSAP(() => {
    if (container.current) {
      const tlIn = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "21% top",
          end: "30% top",
          toggleActions: "play none none reverse"
        }
      })

      tlIn.to(
        material.uniforms.uInProgress,
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
          start: "30% top",
          end: "31% top",
          toggleActions: "play none none reverse"
        }
      })

      tlOut.to(
        material.uniforms.uOutProgress,
        { value: 1, duration: 1, ease: "power2.inOut" },
        "<"
      )
    }
  }, [container])

  return (
    <points
      scale={[
        (0.005 * manCamelTexture.image.width) / manCamelTexture.image.height,
        0.005,
        0.0
      ]}
      geometry={meshGeometry}
      material={material}
      position={[0.2, 0.2, -2]}
    />
  )
}

export default Part2
