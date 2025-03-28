import { useTexture } from "@react-three/drei"
import { useMemo } from "react"
import * as THREE from "three"

const Chapter4 = () => {
  const army = useTexture("/textures/chapter-4/army.png")
  console.log(army)
  const armyMarching2 = useTexture("/textures/chapter-4/soldiers-marching.png")
  const soldiers = useTexture("/textures/chapter-4/soldiers.png")
  const entringMaka = useTexture("/textures/chapter-4/entring1.png")

  const soldierGeometry = useMemo(() => new THREE.PlaneGeometry(1, 1), [])
  const geometry = useMemo(() => new THREE.PlaneGeometry(3, 2), [])
  const geometry2 = useMemo(() => new THREE.PlaneGeometry(5, 3), [])
  const armyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: army,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        side: THREE.DoubleSide
      }),
    []
  )

  const marchingArmy = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: armyMarching2,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        side: THREE.DoubleSide
      }),
    []
  )

  const soldiersMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: soldiers,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        side: THREE.DoubleSide
      }),
    []
  )
  const entringMakaMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: entringMaka,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        side: THREE.DoubleSide
      }),
    []
  )

  return (
    <group position={[0, 0.2, 1.5]} scale={[0.5, 0.5, 0.5]}>
      {/* army marching */}
      <group position={[0, 0, 0]}>
        <mesh
          // rotation-y={Math.PI}
          rotation={[0, 0.2, 5 * (Math.PI / 180)]}
          geometry={geometry2}
          material={armyMaterial}
          position={[0.2, 0.3, -3]}
        />
        <group position={[0.4, 0, 0]}>
          <mesh
            rotation-y={Math.PI}
            geometry={geometry}
            material={marchingArmy}
            position={[-0.5, -0.4, -2]}
          />
          <mesh
            rotation-y={Math.PI}
            geometry={soldierGeometry}
            material={soldiersMaterial}
            position={[0.3, -0.2, -1]}
          />
        </group>
      </group>
      {/* entring maka */}
      {/* <group position={[0, 0, 0]}>
        <mesh
          // rotation-y={Math.PI}
          geometry={geometry}
          material={entringMakaMaterial}
          position={[0.2, -0.25, -2.5]}
        />
      </group> */}
    </group>
  )
}

export default Chapter4
