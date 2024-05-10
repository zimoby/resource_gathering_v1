import { Billboard, Float, Html, Sphere } from "@react-three/drei";
import { useRef, useState } from "react";
import { Group, Mesh } from "three";
import useGamaStore from "../../store";
import { useFrame } from "@react-three/fiber";
import TypingText from "../../effects/TextEffects";
import usePhraseSystem from "./usePhraseSystem";

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

const appearingHeight = 120;

export const FlyingDrone = () => {
  const ref = useRef<Group>(null);
	const [firstAppearing, setFirstAppearing] = useState(true);
	const appearingHeightRef = useRef(-appearingHeight);

	const { activePhrase, phraseKey } = usePhraseSystem({
    minDuration: 10,
    maxDuration: 20,
    phraseDuration: 5,
		firstAppearing
  });

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (!ref.current) return;
    const { x, y, z } = useGamaStore.getState().activePosition;
    const ease = 0.02;

    if (firstAppearing && time > 0.3) {
      ref.current.position.y += (appearingHeightRef.current - ref.current.position.y) * ease;
      if (Math.abs(ref.current.position.y - appearingHeightRef.current) < 2) {
        setFirstAppearing(false);
      }
    } else {
      ref.current.position.x += (x - ref.current.position.x) * ease;
      ref.current.position.y += ((y - appearingHeight) - ref.current.position.y) * ease;
      ref.current.position.z += (z - ref.current.position.z) * ease;
    }
  });

  return (
		<group position={[0,appearingHeight,0]}>
				<group ref={ref}>
			<Float
				position={[0, 20, 0]}
				floatIntensity={10}
				speed={5}
			>
					<Drone />
					<Billboard>
						<Html position={[4, 2, 0]} >
							{activePhrase !== "" && (
									<div
										key={phraseKey}
										className=" w-fit max-w-32 min-w-fit leading-4 text-sm text-left border select-none border-white py-0.5 px-1 bg-black/80"
									>
										<TypingText text={activePhrase} />
									</div>
								)}
						</Html>
					</Billboard>
			</Float>
				</group>
		</group>
  );
};
