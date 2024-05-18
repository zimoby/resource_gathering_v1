import { Billboard, Float, Html, Sphere } from "@react-three/drei";
import { useRef, useState } from "react";
import { Group, Mesh } from "three";
import { useGameStore } from "../../store";
import { useFrame } from "@react-three/fiber";
import TypingText from "../../effects/TextEffectsWrapper";
import usePhraseSystem from "./usePhraseSystem";

export const Drone = () => {
  const sphereRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (sphereRef.current) {
      sphereRef.current.rotation.y = (time / 2) % (2 * Math.PI);
    }
  });

  return (
    <Sphere ref={sphereRef} args={[2, 16, 8]} position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <meshStandardMaterial wireframe color="orange" />
    </Sphere>
  );
};

const appearingHeight = 120;

export const FlyingDrone = () => {
  const ref = useRef<Group>(null);
  const [firstAppearing, setFirstAppearing] = useState(true);
  const appearingHeightRef = useRef(-appearingHeight);
  const showSettingsModal = useGameStore((state) => state.showSettingsModal);
	
  const { activePhrase, phraseKey, handleNextClick } = usePhraseSystem({
    firstAppearing,
  });

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (!ref.current) return;
    const { x, y, z } = useGameStore.getState().activePosition;
    const ease = 0.02;

    if (firstAppearing && time > 0.3) {
      ref.current.position.y += (appearingHeightRef.current - ref.current.position.y) * ease;
      if (Math.abs(ref.current.position.y - appearingHeightRef.current) < 2) {
        setFirstAppearing(false);
      }
    } else {
      ref.current.position.x += (x - ref.current.position.x) * ease;
      ref.current.position.y += (y - appearingHeight - ref.current.position.y) * ease;
      ref.current.position.z += (z - ref.current.position.z) * ease;
    }
  });

  return (
    <group position={[0, appearingHeight, 0]}>
      <group ref={ref}>
        <Float position={[0, 20, 0]} floatIntensity={10} speed={5}>
          <Drone />

          { !showSettingsModal && <Billboard>
            <Html position={[4, 2, 0]}>
              {activePhrase.phrase !== "" && (
                <div className="flex flex-col items-end">
                  <div
                    key={phraseKey}
                    className=" w-44 max-w-xs min-w-fit leading-4 text-uitext text-sm text-left border select-none border-uilines py-0.5 px-1 bg-black/80"
                  >
                    <TypingText text={activePhrase.phrase} speed={50}/>
                  </div>
                  {activePhrase.skipped === false && (
                    <div
                      className="mt-1 text-sm text-uitext text-center py-0.5 px-1 bg-neutral-900 border hover:bg-uilines hover:text-neutral-900 active:bg-neutral-400 active:text-neutral-900 select-none cursor-pointer"
                      onClick={handleNextClick}
                    >
                      Next
                    </div>
                  )}
                </div>
              )}
            </Html>
          </Billboard>}
        </Float>
      </group>
    </group>
  );
};
