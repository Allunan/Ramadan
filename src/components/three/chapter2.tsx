import { useTexture } from "@react-three/drei"
import { useControls } from "leva"
import { useMemo, useState } from "react"
import * as THREE from "three"

const Chapter2 = () => {
  const [showParte1, setShowParte1] = useState(true)
  const [showParte2, setShowParte2] = useState(false)
  const [showParte3, setShowParte3] = useState(false)

  const texture = useTexture("/textures/chapter-2/attack.png")
  const runningTexture = useTexture("/textures/chapter-2/runing1.png")
  const texture2 = useTexture("/textures/chapter-2/men-camel.png")
  const texture3 = useTexture("/textures/chapter-2/monting1.png")
  const texture4 = useTexture("/textures/chapter-2/negociation2.png")
  const texture5 = useTexture("/textures/chapter-2/palm.png")
  const texture6 = useTexture("/textures/chapter-2/birds.png")

  const geometry = useMemo(() => new THREE.PlaneGeometry(2, 2), [])
  const geometry2 = useMemo(() => new THREE.PlaneGeometry(3, 1.5), [])
  const geometry3 = useMemo(() => new THREE.PlaneGeometry(4, 2.2), [])

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
  const runningMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: runningTexture,
        transparent: true,
        depthTest: false,
        depthWrite: false
      }),
    []
  )

  const constrolParte1 = useControls({
    showParte1: {
      value: showParte1,
      label: "chap-2 Parte-1",
      onChange: () => {
        setShowParte1(true)
        setShowParte2(false)
        setShowParte3(false)
      }
    }
  })

  const constrolParte2 = useControls({
    showParte2: {
      value: showParte2,
      label: "chap-2 Parte-2",
      onChange: () => {
        setShowParte1(false)
        setShowParte2(true)
        setShowParte3(false)
      }
    }
  })
  const constrolParte3 = useControls({
    showParte3: {
      value: showParte3,
      label: "chap-2 Parte-3",
      onChange: () => {
        setShowParte1(false)
        setShowParte2(false)
        setShowParte3(true)
      }
    }
  })

  return (
    <group position={[0, 0, 0.35]}>
      {/* attack */}
      {showParte1 && (
        <group position={[-0.2, 0, -0.5]}>
          <mesh
            geometry={geometry2}
            material={material}
            position={[0.4, 0.4, -5]}
          />
          <mesh
            geometry={geometry3}
            material={material3}
            position={[0.4, 0.3, -5.1]}
          />
          <mesh
            geometry={geometry}
            material={runningMaterial}
            position={[-0.4, -0.5, -1.5]}
          />
        </group>
      )}

      {/* negociating */}
      <group position={[0.4, 0, 0]}>
        {showParte2 && (
          <mesh
            geometry={geometry2}
            material={material2}
            position={[0.2, 0, -1]}
          />
        )}
        {showParte3 && (
          <group position={[-0.2, 0, 0]}>
            <mesh
              geometry={geometry}
              material={material6}
              position={[1.2, 0.7, -4]}
            />
            <mesh
              geometry={geometry}
              material={material4}
              position={[0.2, 0, -1]}
            />

            <mesh
              geometry={geometry}
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
