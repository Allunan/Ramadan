import { shaderMaterial, useTexture } from '@react-three/drei'
import { extend, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import fragmentShader from './glsl/foreground/fragment.glsl'
import vertexShader from './glsl/foreground/vertex.glsl'

const ForegroundShader = shaderMaterial(
    {
        uTime: 0,
        uTexture: null,
    },
    vertexShader,
    fragmentShader
)

extend({ForegroundShader})
const Foreground = () => {
    const randTexture = useTexture('/textures/rand.png')
    randTexture.wrapS = THREE.RepeatWrapping
    randTexture.wrapT = THREE.RepeatWrapping
    const {camera, viewport} = useThree()
    const position = new THREE.Vector3(0,0,1)
    const {width, height} = viewport.getCurrentViewport(camera, position)
  return (
    <mesh position={position}>
        <planeGeometry args={[width, height]} />
        <foregroundShader uniforms-uTexture-value={randTexture} key={
          ForegroundShader.key} transparent />
    </mesh>
  )
}

export default Foreground