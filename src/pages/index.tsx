import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Image } from "@react-three/drei";

gsap.registerPlugin(ScrollTrigger);

const Curve: React.FC<{ progress: number }> = ({ progress }) => {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-10, 0, 0),  // Start from the left
    new THREE.Vector3(-5, 0, -2),  // Slight depth change
    new THREE.Vector3(0, 0, -4),   // Centered with more depth
    new THREE.Vector3(5, 0, -3),   // Moving right with reduced depth
    new THREE.Vector3(10, 0, -5),  // Further right, deeper
    new THREE.Vector3(15, 0, -4),  // Slight return towards the camera
    new THREE.Vector3(20, 0, -6),  // Continue right
    new THREE.Vector3(25, 0, -5),  // Final movement
  ]);
  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  useFrame((state) => {
    const camera = state.camera;
    const point = curve.getPoint(progress);

    // Camera follows the curve
    camera.position.set(point.x, point.y, point.z);
    
    // Camera looks slightly ahead (-10 on the Z-axis)
    camera.lookAt(point.x, point.y, point.z - 10);
  });


  return (
    <group>
      <axesHelper args={[4]} />
      <line geometry={geometry}>
        <meshBasicMaterial color={"red"} />
      </line>
      {/* Images placed along the X-axis with subtle depth changes */}
      <Image position={[-10, 0, 0]} url="test.png" />
      <Image position={[-9.5, 0, -1.5]} url="test.png" />

      <Image position={[-5, 0, -2]} url="test.png" />
      <Image position={[-4.5, 0, -3.5]} url="test.png" />

      <Image position={[0, 0, -4]} url="test.png" />
      <Image position={[0.5, 0, -5.5]} url="test.png" />

      <Image position={[5, 0, -3]} url="test.png" />
      <Image position={[5.5, 0, -4.5]} url="test.png" />

      <Image position={[10, 0, -5]} url="test.png" />
      <Image position={[10.5, 0, -6.5]} url="test.png" />

      <Image position={[15, 0, -4]} url="test.png" />
      <Image position={[15.5, 0, -5.5]} url="test.png" />

      <Image position={[20, 0, -6]} url="test.png" />
      <Image position={[20.5, 0, -7.5]} url="test.png" />

      <Image position={[25, 0, -5]} url="test.png" />
      <Image position={[25.5, 0, -6.5]} url="test.png" />
    </group>
  );
};

const Index: React.FC = () => {
  const dummy = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    gsap.to({}, {
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
    });
  }, []);

  return (
    <section className="min-h-screen">
      <div ref={dummy} className="h-[600vh] w-full relative">
        <div className="sticky top-0 left-0 w-full h-screen">
          <Canvas>
            <Curve progress={scrollProgress} />
          </Canvas>
        </div>
      </div>
      <div className="h-screen w-full bg-red-300">Footer</div>
    </section>
  );
};

export default Index;
