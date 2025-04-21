import { useGSAP } from "@gsap/react"
import { OrbitControls, useHelper, useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import gsap from "gsap"
import { easing } from "maath"
import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"

interface BookProps {
  container: React.RefObject<HTMLDivElement>
}

interface PageProps {
  opened: boolean
  isFirstPage?: boolean
  color?: string
  backColor?: string
}

// Page constants
const PAGE_WIDTH = 0.45
const PAGE_HEIGHT = 0.49
const PAGE_DEPTH = 0.003
const PAGE_SEGMENTS = 30
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS

// Animation factors
const easingFactor = 0.9
const easingFactorFold = 0.9
const insideCurveStrength = 0
const outsideCurveStrength = 0.02
const turningCurveStrength = 0.01

// Create base geometry for pages with skinning
const createPageGeometry = () => {
  const pageGeometry = new THREE.BoxGeometry(
    PAGE_WIDTH,
    PAGE_HEIGHT,
    PAGE_DEPTH,
    PAGE_SEGMENTS,
    2
  )

  pageGeometry.translate(PAGE_WIDTH / 2, 0, 0)

  const position = pageGeometry.attributes.position
  const vertex = new THREE.Vector3()
  const skinIndexes: number[] = []
  const skinWeights: number[] = []

  for (let i = 0; i < position.count; i++) {
    // Process all vertices
    vertex.fromBufferAttribute(position, i)
    const x = vertex.x

    const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH))
    let skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH

    skinIndexes.push(skinIndex, skinIndex + 1, 0, 0)
    skinWeights.push(1 - skinWeight, skinWeight, 0, 0)
  }

  pageGeometry.setAttribute(
    "skinIndex",
    new THREE.Uint16BufferAttribute(skinIndexes, 4)
  )
  pageGeometry.setAttribute(
    "skinWeight",
    new THREE.Float32BufferAttribute(skinWeights, 4)
  )

  return pageGeometry
}

// Materials for the page sides
const pageMaterials = [
  new THREE.MeshBasicMaterial({ color: "#dddddd" }), // Edge 1
  new THREE.MeshBasicMaterial({ color: "#cccccc" }), // Edge 2
  new THREE.MeshBasicMaterial({ color: "#dddddd" }), // Edge 3
  new THREE.MeshBasicMaterial({ color: "#cccccc" }) // Edge 4
]

const Page = ({
  opened,
  isFirstPage = false,
  color = "#f5f5f5",
  backColor = "#e0e0e0"
}: PageProps) => {
  const groupRef = useRef<THREE.Group>(null)
  const skinnedMeshRef = useRef<THREE.SkinnedMesh>(null)
  const [highlighted, setHighlighted] = useState(false)
  const turnedAt = useRef<number>(0)
  const lastOpened = useRef<boolean>(opened)

  const insideCurveStrength = useRef(0)

  useEffect(() => {
    if (opened) {
      gsap.to(insideCurveStrength, {
        current: 0.18,
        duration: 1
      })
    }
  }, [opened])

  const manualSkinnedMesh = useMemo(() => {
    const bones: THREE.Bone[] = []
    // Create bones for page segments
    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      let bone = new THREE.Bone()
      bones.push(bone)
      if (i === 0) {
        bone.position.x = 0
      } else {
        bone.position.x = SEGMENT_WIDTH
      }
      if (i > 0) {
        bones[i - 1].add(bone) // attach the new bone to the previous one
      }
    }
    const skeleton = new THREE.Skeleton(bones)

    // Create materials with colors only
    const frontMaterial = new THREE.MeshBasicMaterial({
      color: color,
      side: THREE.FrontSide
    })

    const backMaterial = new THREE.MeshBasicMaterial({
      color: backColor,
      side: THREE.FrontSide
    })

    const materials = [...pageMaterials, frontMaterial, backMaterial]

    // Create skinned mesh
    const mesh = new THREE.SkinnedMesh(createPageGeometry(), materials)
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.frustumCulled = false
    mesh.add(skeleton.bones[0])
    mesh.bind(skeleton)

    return mesh
  }, [color, backColor])

  useFrame((_, delta) => {
    if (!skinnedMeshRef.current || !groupRef.current) return

    // Update materials color based on highlight state
    const materials = skinnedMeshRef.current.material as THREE.Material[]
    if (materials.length > 4) {
      // Brighten colors when highlighted
      const frontMat = materials[4] as THREE.MeshBasicMaterial
      const backMat = materials[5] as THREE.MeshBasicMaterial

      if (frontMat && backMat) {
        frontMat.color.lerp(
          new THREE.Color(highlighted ? "#ffffff" : color),
          0.1
        )

        backMat.color.lerp(
          new THREE.Color(highlighted ? "#f8f8f8" : backColor),
          0.1
        )
      }
    }

    // Track when page opening/closing state changes
    if (lastOpened.current !== opened) {
      turnedAt.current = Date.now()
      lastOpened.current = opened
    }

    // Calculate turning time progress (0 to 1)
    let turningTime = Math.min(400, Date.now() - turnedAt.current) / 400
    turningTime = Math.sin(turningTime * Math.PI)

    // Target rotation based on opened state - full rotation for first page
    let targetRotation = opened ? -Math.PI : 0

    // Apply bone rotations for page curling effect
    if (skinnedMeshRef.current.skeleton) {
      const bones = skinnedMeshRef.current.skeleton.bones
      for (let i = 0; i < bones.length; i++) {
        const target = i === 0 ? groupRef.current : bones[i]
        // const target = bones[i]

        // Calculate different curve intensities
        const insideCurveIntensity =
          i < 8 ? Math.sin(i * 0.1 + 2.3 * (1 - i / bones.length)) * 1 : 0
        const outsideCurveIntensity = i >= 8 ? Math.cos(i * 0.3 + 0.09) : 0
        const turningIntensity =
          Math.sin(i * Math.PI * (1 / bones.length)) * turningTime

        // Calculate rotation angle with all effects combined
        let rotationAngle =
          insideCurveStrength.current * insideCurveIntensity * targetRotation -
          outsideCurveStrength * outsideCurveIntensity * targetRotation +
          turningCurveStrength * turningIntensity * targetRotation

        let foldRotationAngle = THREE.MathUtils.degToRad(
          Math.sign(targetRotation) * 2
        )

        // Apply rotation with damping for smooth animation
        easing.dampAngle(
          target.rotation,
          "y",
          rotationAngle,
          easingFactor,
          delta
        )

        // Add folding effect on x-axis
        const foldIntensity =
          i > 8
            ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime
            : 0

        easing.dampAngle(
          target.rotation,
          "x",
          foldRotationAngle * foldIntensity,
          easingFactorFold,
          delta
        )
      }
    }
  })

  useHelper(skinnedMeshRef, THREE.SkeletonHelper)

  return (
    <group
      ref={groupRef}
      position={[-PAGE_WIDTH / 2, 0, 0]}
      onPointerEnter={(e) => {
        e.stopPropagation()
        setHighlighted(true)
      }}
      onPointerLeave={(e) => {
        e.stopPropagation()
        setHighlighted(false)
      }}>
      <primitive
        object={manualSkinnedMesh}
        ref={skinnedMeshRef}
        position={[0, 0, 0]}
      />
    </group>
  )
}

const Book = ({ container }: BookProps) => {
  // Load textures
  const texture = useTexture("textures/book/texture.png")
  const aoMap = useTexture("textures/book/ao.png")
  const normalMap = useTexture("textures/book/normal.png")
  const heightMap = useTexture("textures/book/height.png")
  const metalnessMap = useTexture("textures/book/metalness.png")
  const roughnessMap = useTexture("textures/book/roughness.png")

  // Refs for different parts of the book
  const bookGroupRef = useRef<THREE.Group>(null)
  const frontCoverRef = useRef<THREE.Group>(null)
  const backCoverRef = useRef<THREE.Mesh>(null)

  // State for tracking if the book is open
  const [isOpen, setIsOpen] = useState<boolean>(false)

  // Book dimensions
  const bookWidth = 0.5
  const bookHeight = 0.5
  const bookThickness = 0.01 // Thickness of the book cover

  useGSAP(() => {
    if (frontCoverRef.current) {
      // Animate front cover opening
      gsap.to(frontCoverRef.current.rotation, {
        y: -Math.PI,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
          setIsOpen(true)
        }
      })
    }
  })

  return (
    <group ref={bookGroupRef} position={[0, 0, 0.35]}>
      {/* Front Cover */}
      <group
        ref={frontCoverRef}
        position={[-bookWidth / 2, 0, bookThickness / 2]}>
        <mesh position={[bookWidth / 2, 0, bookThickness / 2]}>
          <boxGeometry args={[bookWidth, bookHeight, bookThickness / 2]} />
          <meshStandardMaterial
            map={texture}
            aoMap={aoMap}
            aoMapIntensity={2}
            bumpMap={heightMap}
            normalMap={normalMap}
            metalnessMap={metalnessMap}
            roughnessMap={roughnessMap}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Page (completes full rotation) */}
      <Page opened={false} color="#f5f5f5" backColor="#e5e5e5" />
      <Page opened={isOpen} color="#f5f5f5" backColor="#e5e5e5" />

      {/* Back Cover */}
      <mesh ref={backCoverRef} position={[0, 0, -bookThickness / 2]}>
        <boxGeometry args={[bookWidth, bookHeight, bookThickness / 2]} />
        <meshStandardMaterial
          map={texture}
          aoMap={aoMap}
          aoMapIntensity={2}
          bumpMap={heightMap}
          normalMap={normalMap}
          metalnessMap={metalnessMap}
          roughnessMap={roughnessMap}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Lighting */}
      <directionalLight position={[0, 0, 1]} intensity={2} />
      <directionalLight position={[0, 0, -1]} intensity={1} />
      <directionalLight position={[1, 0, 0]} intensity={1} />
      <directionalLight position={[-1, 0, 0]} intensity={1} />
      <OrbitControls />
    </group>
  )
}

export default Book
