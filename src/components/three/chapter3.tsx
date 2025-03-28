import { useTexture } from "@react-three/drei"
import { useMemo } from "react"
import * as THREE from "three"

const Chapter3 = () => {
  const prepaTexture = useTexture("/textures/Chapter-3/preparing2.png")
  const palmTexture = useTexture("/textures/chapter-1/palm-tree1.png")
  const bridsTexture = useTexture("/textures/chapter-2/birds.png")

  const palmGeometry = useMemo(() => new THREE.PlaneGeometry(1, 1), [])
  const geometry = useMemo(() => new THREE.PlaneGeometry(2, 2), [])
  const geometry2 = useMemo(() => new THREE.PlaneGeometry(3, 1.5), [])
  const geometry3 = useMemo(() => new THREE.PlaneGeometry(0.3, 0.3), [])
  const geometry4 = useMemo(() => new THREE.PlaneGeometry(0.2, 0.2), [])
  const geometry5 = useMemo(() => new THREE.PlaneGeometry(0.6, 0.6), [])

  const preparMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: prepaTexture,
        transparent: true,
        depthTest: false,
        depthWrite: false
      }),
    []
  )

  const material2 = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: palmTexture,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        side: THREE.DoubleSide
      }),
    []
  )
  const material3 = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: bridsTexture,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        side: THREE.DoubleSide
      }),
    []
  )

  return (
    <group position={[0, 0, 0.35]}>
      {/* preparing */}
      <group position={[0.4, 0, -1]}>
        <mesh
          geometry={geometry}
          material={material3}
          position={[0.8, 0.9, -5]}
        />
        {/* <mesh
          geometry={palmGeometry}
          material={material2}
          position={[0.9, 0, 0]}
        /> */}
        <mesh
          geometry={palmGeometry}
          material={material2}
          position={[0.5, 0.1, 1]}
        />
        <mesh
          geometry={geometry3}
          material={material2}
          position={[-0.49, 0.11, 0.5]}
        />
        {/* <mesh
          rotation-y={Math.PI}
          geometry={geometry4}
          material={material2}
          position={[-0.5, 0.1, 1]}
        /> */}
        <mesh
          geometry={geometry2}
          material={preparMaterial}
          position={[0.2, 0, -1]}
        />
      </group>
    </group>
  )
}

export default Chapter3
