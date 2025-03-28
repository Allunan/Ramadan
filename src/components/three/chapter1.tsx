import { useGSAP } from "@gsap/react"
import { useTexture } from "@react-three/drei"
import gsap from "gsap"
import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import fragmentShader from "./glsl/filtering/fragment.glsl"
import vertexShader from "./glsl/filtering/vertex.glsl"

const Chapter1: React.FC<{ container: React.RefObject<HTMLDivElement> }> = ({
  container
}) => {
  const texture = useTexture("/textures/chapter-1/men1.png")
  const texture2 = useTexture("/textures/chapter-1/palm-tree1.png")
  const texture3 = useTexture("/textures/chapter-1/tent2.png")
  const mountTexture1 = useTexture("/textures/chapter-1/monting1.png")

  const menRef = useRef<THREE.Mesh>(null)
  const palmTreesRef = useRef<THREE.Group>(null)
  const tentRef = useRef<THREE.Mesh>(null)
  const mountingRef = useRef<THREE.Group>(null)

  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1, 1), [])
  const geometry2 = useMemo(() => new THREE.PlaneGeometry(3, 1.5), [])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
          uTexture: { value: texture },
          uResolution: {
            value: new THREE.Vector2(texture.image.width, texture.image.height)
          },
          uInProgress: { value: 0 },
          uOutProgress: { value: 0.0 }
        },
        transparent: true,
        depthTest: false,
        depthWrite: false,
        side: THREE.DoubleSide
      }),
    []
  )
  const material2 = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
          uTexture: { value: texture2 },
          uInProgress: { value: 0.1 },
          uOutProgress: { value: 0.0 }
        },
        transparent: true,
        depthTest: false,
        depthWrite: false,

        side: THREE.DoubleSide
      }),
    []
  )
  const material3 = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
          uTexture: { value: texture3 },
          uInProgress: { value: 0.1 },
          uOutProgress: { value: 0.0 }
        },
        transparent: true,
        depthTest: false,
        depthWrite: false,
        side: THREE.DoubleSide
      }),
    []
  )

  const material4 = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
          uTexture: { value: mountTexture1 },
          uInProgress: { value: 0.1 },
          uOutProgress: { value: 0.0 }
        },
        transparent: true,
        depthTest: false,
        depthWrite: false,
        side: THREE.DoubleSide
      }),
    []
  )

  const checkedScroll = useRef(false)
  useEffect(() => {
    if (
      Math.abs(container.current!.getBoundingClientRect().height) >
        container.current!.getClientRects()[0].height * 0.1 &&
      !checkedScroll.current
    ) {
      checkedScroll.current = true
    }
  }, [])
  useGSAP(() => {
    const tlIn = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "10% top",
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

    const tlOut = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "10% top",
        end: "9% top",
        markers: true,
        toggleActions: "play none reverse none",
        onEnter: () => {
          if (
            Math.abs(container.current!.getBoundingClientRect().height) >
              container.current!.getClientRects()[0].height * 0.1 &&
            !checkedScroll.current
          ) {
            tlOut.progress(1)
            checkedScroll.current = true
            console.log(
              Math.abs(container.current!.getBoundingClientRect().height) >
                container.current!.getClientRects()[0].height * 0.1
            )
          }
        }
      }
    })
    const totalDuration = 1
    /**
     * Materials IN Progress animation
     */
    tlIn
      .to(material.uniforms.uInProgress, {
        value: 1,
        duration: totalDuration,
        ease: "power2.inOut"
      })
      .to(
        material2.uniforms.uInProgress,
        {
          value: 1,
          duration: totalDuration,
          ease: "power2.inOut"
        },
        "<"
      )
      .to(
        material3.uniforms.uInProgress,
        {
          value: 1,
          duration: totalDuration,
          ease: "power2.inOut"
        },
        "<"
      )
      .to(
        material4.uniforms.uInProgress,
        {
          value: 1,
          duration: totalDuration,
          ease: "power2.inOut"
        },
        "<"
      )
    /**
     * Materials Out Progress animation
     */
    tlOut
      .to(
        material.uniforms.uOutProgress,
        {
          value: 1,
          duration: totalDuration,
          ease: "power2.inOut"
        },
        "<"
      )
      .to(
        material2.uniforms.uOutProgress,
        {
          value: 1,
          duration: totalDuration,
          ease: "power2.inOut"
        },
        "<"
      )
      .to(
        material3.uniforms.uOutProgress,
        {
          value: 1,
          duration: totalDuration,
          ease: "power2.inOut"
        },
        "<"
      )
      .to(
        material4.uniforms.uOutProgress,
        {
          value: 1,
          duration: totalDuration,
          ease: "power2.inOut"
        },
        "<"
      )
    /**
     * Positions animations
     */
    if (
      menRef.current &&
      palmTreesRef.current &&
      tentRef.current &&
      mountingRef.current
    ) {
      tlIn.from(
        menRef.current.position,
        {
          x: menRef.current.position.x + 0.1,
          y: menRef.current.position.y + 0.1,
          z: menRef.current.position.z + 0.1,
          duration: totalDuration
        },
        "<"
      )
      tlIn.from(
        palmTreesRef.current.position,
        {
          y: palmTreesRef.current.position.y - 0.1,
          z: palmTreesRef.current.position.z - 0.1,
          duration: totalDuration
        },
        "<"
      )
      tlIn.from(
        tentRef.current.position,
        {
          x: tentRef.current.position.x - 0.1,
          y: tentRef.current.position.y - 0.1,
          z: tentRef.current.position.z + 0.1,
          duration: totalDuration
        },
        "<"
      )
      tlIn.from(
        mountingRef.current.position,
        {
          x: mountingRef.current.position.x - 0.1,
          y: mountingRef.current.position.y + 0.1,
          z: mountingRef.current.position.z - 0.1,
          duration: totalDuration
        },
        "<"
      )
    }
  })

  return (
    <group position={[0.2, -0.2, 0.35]}>
      {/* Men */}
      <mesh
        ref={menRef}
        geometry={geometry}
        material={material}
        position={[-0.3, 0, -0.6]}
      />
      {/* Palm Trees */}
      <group ref={palmTreesRef}>
        <mesh
          rotation-y={Math.PI}
          position={[0.35, 0.2, -0.8]}
          geometry={geometry}
          material={material2}
        />
        <mesh
          rotation-y={Math.PI}
          position={[-2.3, 0.2, -2.5]}
          geometry={geometry}
          material={material2}
        />
        <mesh
          rotation-y={0}
          position={[-1.8, 1, -7]}
          geometry={geometry}
          material={material2}
        />
        <mesh
          rotation-y={0}
          position={[0.5, 0.15, 0.6]}
          geometry={geometry}
          material={material2}
        />
        <mesh
          rotation-y={0}
          position={[-1, 0, -1]}
          geometry={geometry}
          material={material2}
        />
      </group>
      {/* Tent */}
      <mesh
        ref={tentRef}
        position={[-0.2, 0.3, -1.5]}
        geometry={geometry2}
        material={material3}
      />
      {/* Mounting */}
      <group ref={mountingRef}>
        <mesh
          position={[-2, 0.2, -10]}
          rotation-y={Math.PI}
          rotation={[0, 0.3, 0]}
          material={material4}>
          <planeGeometry args={[12, 6]} />
        </mesh>
        <mesh
          position={[0.5, 0.5, -10]}
          rotation={[0, -0.3, 0]}
          material={material4}>
          <planeGeometry args={[10, 6]} />
        </mesh>
      </group>
    </group>
  )
}

export default Chapter1
