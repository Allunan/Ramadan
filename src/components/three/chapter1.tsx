import { useTexture } from "@react-three/drei"
import { useMemo } from "react"
import * as THREE from "three"

const Chapter1 = () => {
  const texture = useTexture("/textures/chapter-1/men1.png")
  const texture2 = useTexture("/textures/chapter-1/palm-tree1.png")
  const texture3 = useTexture("/textures/chapter-1/tent2.png")
  const mountTexture1 = useTexture("/textures/chapter-1/monting1.png")
  const mountTexture2 = useTexture("/textures/chapter-1/monting2.png")

  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1, 1), [])
  const geometry2 = useMemo(() => new THREE.PlaneGeometry(3, 1.5), [])

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
        depthWrite: false
      }),
    []
  )
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
  const material3 = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: texture3,
        transparent: true,
        depthTest: false,
        depthWrite: false
      }),
    []
  )

  return (
    <group position={[0.2, -0.2, 0.35]}>
      {/* Men */}
      <mesh
        geometry={geometry}
        material={material}
        position={[-0.3, 0, -0.6]}
      />
      {/* Palm Trees */}
      <group>
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
        position={[-0.2, 0.3, -1.5]}
        geometry={geometry2}
        material={material3}
      />
      {/* Mounting */}
      <mesh
        position={[-2, 0.2, -10]}
        rotation-y={Math.PI}
        rotation={[0, 0.3, 0]}>
        <planeGeometry args={[12, 6]} />
        <meshBasicMaterial
          color="white"
          transparent
          map={mountTexture1}
          depthTest={false}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0.5, 0.5, -10]} rotation={[0, -0.3, 0]}>
        <planeGeometry args={[10, 6]} />
        <meshBasicMaterial
          color="white"
          transparent
          map={mountTexture1}
          depthTest={false}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

export default Chapter1
