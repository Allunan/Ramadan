import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

gsap.registerPlugin(ScrollTrigger);

const Curve: React.FC<{ progress: number }> = ({ progress }) => {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(5, 0, -5),
    new THREE.Vector3(0, 0, -10),
    new THREE.Vector3(-5, 0, -15),
    new THREE.Vector3(0, 0, -20),
    new THREE.Vector3(5, 0, -25),
    new THREE.Vector3(0, 0, -30),
    new THREE.Vector3(-5, 0, -35),
    new THREE.Vector3(0, 0, -40),
  ]);
  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  useFrame((state) => {
    const camera = state.camera;
    const point = curve.getPoint(progress);
    camera.position.set(point.x, point.y, point.z);
    camera.lookAt(curve.getPoint(progress + 0.01));
  });

  return (
    <group>
      <axesHelper args={[4]} />
      <line geometry={geometry}>
        <meshBasicMaterial color={"red"} />
      </line>
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
