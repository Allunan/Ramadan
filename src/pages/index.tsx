import { Environment, Image, OrbitControls, Stars } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

const Curve: React.FC<{ progress: number }> = ({ progress }) => {
	// const colorMap = useLoader(THREE.TextureLoader, "public/texture/GroundSand005_COL_2K.jpg");
	const normalMap = useLoader(
		THREE.TextureLoader,
		"/texture/GroundSand005_NRM_2K.jpg",
	);
	const displacementMap = useLoader(
		THREE.TextureLoader,
		"/texture/GroundSand005_DISP_2K.jpg",
	);
	const aoMap = useLoader(
		THREE.TextureLoader,
		"/texture/GroundSand005_AO_2K.jpg",
	);
	const roughnessMap = useLoader(
		THREE.TextureLoader,
		"/texture/GroundSand005_GLOSS_2K.jpg",
	);

	// colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping;
	normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
	displacementMap.wrapS = displacementMap.wrapT = THREE.RepeatWrapping;
	aoMap.wrapS = aoMap.wrapT = THREE.RepeatWrapping;
	roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;

	// colorMap.repeat.set(10, 10);
	normalMap.repeat.set(10, 10);
	displacementMap.repeat.set(10, 10);
	aoMap.repeat.set(10, 10);
	roughnessMap.repeat.set(10, 10);

	const curve = new THREE.CatmullRomCurve3(
		[
			new THREE.Vector3(-10, 0, 0), // Start from the left
			new THREE.Vector3(-8, 0.3, 0.2), // Slight depth change
			new THREE.Vector3(-7.5, 0, -0.9), // Centered with more depth
			new THREE.Vector3(-7, 0, -0.9), // Centered with more depth
			new THREE.Vector3(5, 0, 0.8), // Moving right with reduced depth
			new THREE.Vector3(8, -2, 0.8), // Slight return towards the camera
			new THREE.Vector3(8, -4, 0.9), // Further right, deeper
			new THREE.Vector3(10, -8, 0.9), // Further right, deeper
			new THREE.Vector3(10, -12, 0.9), // Slight return towards the camera
			new THREE.Vector3(15, -2, 0.1), // Slight return towards the camera
			new THREE.Vector3(20, 0, -6), // Continue right
			new THREE.Vector3(25, 0, -5), // Final movement
		], // Points for the curve
		false, // Closed curve
		"catmullrom", // Curve type
		0.15, // Tension
	);

	const points = curve.getPoints(120); // Number of points to generate
	const geometry = new THREE.BufferGeometry().setFromPoints(points); // Create geometry

	const planeRef = useRef<THREE.Mesh>(null);

	useFrame((state) => {
		const camera = state.camera;
		const point = curve.getPoint(progress);

		// Camera follows the curve
		camera.position.set(point.x, point.y, point.z);

		// Camera looks slightly ahead (-10 on the Z-axis)
		camera.lookAt(point.x, point.y, point.z - 10);

		if (planeRef.current) {
			const time = state.clock.getElapsedTime();
			const geometry = planeRef.current.geometry as THREE.PlaneGeometry;
			const position = geometry.attributes.position;

			for (let i = 0; i < position.count; i++) {
				const x = position.getX(i);
				const y = position.getY(i);
				const wave =
					Math.sin(x * 0.1 + time) * 0.1 + Math.cos(y * 0.1 + time) * 0.08;
				position.setZ(i, wave);
			}
			position.needsUpdate = true;
		}
	});

	return (
		<group>
			{/* <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} /> */}
			{/* <Environment files={["moon.jpg"]}  background blur={1} /> */}
			<ambientLight intensity={0.5} />
			<pointLight position={[10, 0, 10]} intensity={1} castShadow />{" "}
			{/* Enable shadow casting */}
			<axesHelper args={[4]} />
			<line geometry={geometry}>
				<meshBasicMaterial color={"red"} />
			</line>
			{/* Images placed along the X-axis with subtle depth changes */}
			<group>
				{/* <Image position={[-9.5, 0, -1.5]} url="/texture/monting.png" transparent={true} scale={[3, 1.9]} castShadow /> */}
				<Image
					position={[-10.7, 0, -1.9]}
					transparent={true}
					url="/texture/tent2.png"
					scale={[2, 1.2]}
					castShadow
				/>
				<Image
					position={[-9.7, -0.2, -1]}
					url="/texture/group2.png"
					transparent={true}
					scale={[1, 1]}
					castShadow
				/>
				<Image
					position={[-12, 0, -2]}
					url="/texture/palm-tree1.png"
					transparent={true}
					scale={[1, 2.2]}
					castShadow
				/>
				<Image
					position={[-12, 0, -6]}
					url="/texture/palm-tree1.png"
					transparent={true}
					scale={[1, 1.8]}
					castShadow
				/>
				<Image
					position={[-19, 0, -7]}
					url="/texture/palm-tree1.png"
					transparent={true}
					scale={[1, 1.8]}
					castShadow
				/>
				<Image
					position={[-11, 0, -6]}
					url="/texture/palm-tree1.png"
					transparent={true}
					scale={[1, 1.8]}
					castShadow
				/>
				<Image
					position={[-8, 0, -1.5]}
					url="/texture/palm-tree1.png"
					transparent={true}
					scale={[1.2, 2]}
					castShadow
				/>
				<Image
					position={[-8, 0, -5.5]}
					url="/texture/palm-tree1.png"
					transparent={true}
					scale={[1.5, 2]}
					castShadow
				/>
				{/* <Image position={[-5, 0, -1]} url="/texture/palm-tree1.png" transparent={true} scale={[2, 2.8]} castShadow /> */}
				{/* <Image position={[-5, 0, -5]} url="/texture/palm-tree1.png" transparent={true} scale={[2, 2.8]} castShadow /> */}
				<Image
					position={[-5, 0, -0.5]}
					url="/texture/palm-tree1.png"
					transparent={true}
					scale={[2.5, 3.2]}
					castShadow
				/>
				<Image
					position={[-11, -0.4, -1.5]}
					url="/texture/camel1.png"
					transparent={true}
					scale={0.6}
					castShadow
				/>
			</group>
			<group>
				<Image
					position={[0, 0, -2]}
					transparent={true}
					url="/texture/chapter2/attack.png"
					scale={[2.5, 1.4]}
					castShadow
				/>
			</group>
			<group>
				{/* <Image position={[6.5, 0, -1]} url="/texture/monting.png" transparent={true} scale={[3, 1.9]} castShadow /> */}
				<Image
					position={[7, 0, -2]}
					transparent={true}
					url="/texture/chapter3/chapt4.png"
					scale={[3.5, 2]}
					castShadow
					color={"#e4d0b5"}
				/>
				<Image
					position={[6, 0, -4]}
					transparent={true}
					url="/texture/chapter3/camel2.png"
					scale={[3.5, 2]}
					castShadow
					color={"#e4d0b5"}
				/>
				<Image
					position={[6.7, 0.4, -2.1]}
					transparent={true}
					url="/texture/chapter3/palm7.png"
					scale={[1.5, 2]}
					castShadow
				/>
				<Image
					position={[7, -4, -1]}
					transparent={true}
					url="/texture/chapter3/prepar1.png"
					scale={[3, 1.6]}
					castShadow
				/>
			</group>
			{/* <mesh
        ref={planeRef}
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1, 0]}
      >
        <planeGeometry args={[100, 100, 256, 256]} />
        <meshStandardMaterial
          // map={colorMap}
          color={"rgb(235, 200, 160)"}
          normalMap={normalMap}
          displacementMap={displacementMap}
          displacementScale={0.5} // Adjust for desired height
          aoMap={aoMap}
          roughnessMap={roughnessMap}
        />
      </mesh> */}
		</group>
	);
};

const Index: React.FC = () => {
	const dummy = useRef<HTMLDivElement>(null);
	const [scrollProgress, setScrollProgress] = useState(0);

	useEffect(() => {
		window.scrollTo(0, 0);

		gsap.to(
			{},
			{
				scrollTrigger: {
					trigger: dummy.current,
					start: "top top",
					end: "bottom bottom",
					scrub: true,
					markers: true,
					onUpdate: (self) => {
						setScrollProgress(self.progress);
					},
				},
			},
		);
	}, []);

	return (
		<section className="min-h-screen">
			<div ref={dummy} className="h-[1000vh] w-full relative">
				<div className="sticky top-0 left-0 w-full h-screen">
					<Canvas
						shadows // Enable shadows
						// color="black"
						camera={{ position: [0, 0, 0], fov: 75 }}
					>
						<ambientLight intensity={0.5} />
						<spotLight
							position={[10, 10, 10]}
							angle={0.15}
							penumbra={1}
							intensity={1}
							castShadow
						/>
						<Curve progress={scrollProgress} />
						<color attach="background" args={["#e5d9c2"]} />
					</Canvas>
				</div>
			</div>
			<div className="h-screen w-full bg-red-300">Footer</div>
		</section>
	);
};

export default Index;
