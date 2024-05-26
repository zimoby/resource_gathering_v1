import { Hud, PerspectiveCamera, Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";

const SpherePlanet = () => {
  const sphereRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta;
    }
  });

  return (
    <Sphere ref={sphereRef} args={[4, 16, 8]} position={[0, 0, 0]}>
      <meshStandardMaterial wireframe color={"#ffffff"} />
    </Sphere>
  );
};

export function Viewcube({ renderPriority = 1 }) {
  return (
    <Hud renderPriority={renderPriority}>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <PerspectiveCamera makeDefault position={[30, -20, 60]} />
      <SpherePlanet />
      <ambientLight intensity={1} />
      <pointLight position={[200, 200, 100]} intensity={0.5} />
    </Hud>
  );
}
