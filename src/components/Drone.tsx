import { Billboard, Float, Html, Sphere } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { Group, Mesh } from "three";
import useGamaStore from "../store";
import { useFrame } from "@react-three/fiber";
import TypingText from "../animations/TextEffects";

export const Drone = () => {
	const sphereRef = useRef<Mesh>(null);

	useFrame(({clock}) => {
		const time = clock.getElapsedTime();
		if (sphereRef.current) {
			sphereRef.current.rotation.y = (time / 2) % (2 * Math.PI);
		}
	});

  return (
    <Sphere ref={sphereRef} args={[2, 16, 8]} position={[0, 0, 0]} rotation={[0,0,0]}>
      <meshStandardMaterial wireframe color="orange" />
    </Sphere>
  );
};

export const FlyingDrone = () => {
  const ref = useRef<Group>(null);
	// const activePosition = useGamaStore((state) => state.activePosition);
	const [activePhrase, setActivePhrase] = useState<string>("");
	const PhrasesCollection = [
		"Hi!",
		"Hello there!",
		"How are you today?",
		"Nice weather, isn't it?",
		"What can I do for you?",
		"Is there anything I can assist you with?",
		"I hope you're having a great day!",
		"Just passing by to say hello!",
		"Enjoying the view?",
		"I'm here to make your life easier!",
		"Let me know if you need anything!",
		"I'm at your service!",
		"We need to add more beacons!",
		"Welcome to our unknown planet!",
		"Exploring the mysteries of this planet!",
		"Isn't this planet fascinating?",
		"Discovering new life forms!",
		"Adventures await on this unknown planet!",
		"Uncovering the secrets of this alien world!",
	];

	useEffect(() => {
		// select random phrase every 15 seconds
		const interval = setInterval(() => {
			const randomIndex = Math.floor(Math.random() * PhrasesCollection.length);
			setActivePhrase(PhrasesCollection[randomIndex]);
		}, 15000);
		return () => clearInterval(interval);
	}, []);

	// clean phrase every 5 seconds after appearing
	useEffect(() => {
		const timeout = setTimeout(() => {
			setActivePhrase("");
		}, 5000);
		return () => clearTimeout(timeout);
	}, [activePhrase]);


	useFrame(() => {
		if (!ref.current) return;
		const { x, y, z } = useGamaStore.getState().activePosition;
		const ease = 0.02;
		ref.current.position.x += (x - ref.current.position.x) * ease;
		ref.current.position.y += (y - ref.current.position.y) * ease;
		ref.current.position.z += (z - ref.current.position.z) * ease;

	});

  return (
    <Float
			position={[0, 20, 0]}
      floatIntensity={10}
      speed={5}
    >
			<group ref={ref}>
				<Drone />
				<Billboard>
					<Html position={[4, 2, 0]} >
						{activePhrase !== "" && <div className="w-fit max-w-32 min-w-14 leading-4 text-sm text-left border select-none border-white py-0.5 px-1 bg-black/80">
							<TypingText text={activePhrase} />
						</div>}
					</Html>
				</Billboard>
			</group>
    </Float>
  );
};
