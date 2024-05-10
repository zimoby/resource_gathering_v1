import { Float, Sphere } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Mesh } from "three";
import useGamaStore from "../store";
import { useFrame } from "@react-three/fiber";

export const Drone = () => {
  const ref = useRef<Mesh>(null);
	const activePosition = useGamaStore((state) => state.activePosition);

	useEffect(() => {
		console.log("Active position:", activePosition);
	}, [activePosition]);

	useFrame(({clock}) => {
		const time = clock.getElapsedTime();
		if (!ref.current) return;
		const { x, y, z } = activePosition;
		const ease = 0.02;
		ref.current.position.x += (x - ref.current.position.x) * ease;
		ref.current.position.y += (y - ref.current.position.y) * ease;
		ref.current.position.z += (z - ref.current.position.z) * ease;

		ref.current.rotation.y = (time / 2) % (2 * Math.PI);
	});

  return (
    <Sphere ref={ref} args={[2, 16, 8]} position={[0, 0, 0]} rotation={[0,0,0]}>
      <meshStandardMaterial wireframe color="orange" />
    </Sphere>
  );
};

export const FlyingDrone = () => {
  return (
    <Float
			position={[0, 20, 0]}
      floatIntensity={10}
      speed={5}
    >
      <Drone />
    </Float>
  );
};
