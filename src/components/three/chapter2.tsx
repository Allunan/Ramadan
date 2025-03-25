import { useTexture } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

const Chapter1 = () => {
    const texture = useTexture("/textures/chapter-1/men.png");
    const texture2 = useTexture("/textures/chapter-1/palm-tree.png");
    const texture3 = useTexture("/textures/chapter-1/tent.png");

    const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1, 1), [])
    const geometry2 = useMemo(() => new THREE.PlaneGeometry(3, 1.5), [])

    const material = useMemo(() => new THREE.MeshStandardMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false }), [])
    const material2 = useMemo(() => new THREE.MeshStandardMaterial({ map: texture2, transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSide }), [])
    const material3 = useMemo(() => new THREE.MeshStandardMaterial({ map: texture3, transparent: true, depthTest: false, depthWrite: false }), [])

  return (
    <group position={[0.2, -0.2, 0]}>
        {/* Men */}
        <mesh geometry={geometry} material={material} />
        {/* Palm Trees */}
        <group>
            <mesh rotation-y={Math.PI} position={[0.5, 0, -0.5]} geometry={geometry} material={material2} />
            <mesh rotation-y={Math.PI} position={[-2., 0, -2.5]} geometry={geometry} material={material2} />
            <mesh rotation-y={Math.PI} position={[1.5, 0, -1.5]} geometry={geometry} material={material2} />
            <mesh rotation-y={0} position={[1, 0, -0]} geometry={geometry} material={material2} />
            <mesh rotation-y={0} position={[-1, 0, -1]} geometry={geometry} material={material2} />
        </group>
            {/* Tent */}
            <mesh position={[-0.5, 0, -3.]} geometry={geometry2} material={material3} />
    </group>
  )
}

export default Chapter1