import { Billboard, Float, Html, Sphere } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { Group, Mesh } from "three";
import { useGameStore } from "../../store/store";
import { useFrame } from "@react-three/fiber";
import TypingText from "../../effects/TextEffectsWrapper";
import usePhraseSystem from "./usePhraseSystem";
import { useSoundSystem } from "../../hooks/soundSystem";
import { throttle } from "lodash";
// import { useCheckVariableRender } from "../../utils/functions";

export const Drone = () => {
  const sphereRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (sphereRef.current) {
      sphereRef.current.rotation.y = (time / 2) % (2 * Math.PI);
    }
  });

  return (
    <Sphere
      ref={sphereRef}
      args={[2, 16, 8]}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
    >
      <meshStandardMaterial wireframe color="orange" />
    </Sphere>
  );
};

const appearingHeight = 120;

export const FlyingDrone = () => {
  const ref = useRef<Group>(null);
  const [firstAppearing, setFirstAppearing] = useState(true);
  const droneDirectionAngleRef = useRef(0);
  // const droneHeightHistoryRef = useRef([] as number[]);
  const appearingHeightRef = useRef(-appearingHeight);
  const showSettingsModal = useGameStore((state) => state.showSettingsModal);
  const showAboutModal = useGameStore((state) => state.showAboutModal);
  const setMapAnimationState = useGameStore(
    (state) => state.setMapAnimationState,
  );
  const educationMode = useGameStore((state) => state.educationMode);
  const disableSounds = useGameStore((state) => state.disableSounds);
  const startStageFinished = useGameStore((state) => state.startStageFinished);
  // const droneVectorMovement = useGameStore(
  //   (state) => state.droneVectorMovement,
  // );

  // const droneMoveAngle = useGameStore((state) => state.droneMoveAngle);

  // useCheckVariableRender(droneMoveAngle, "droneMoveAngle");

  const { activePhrase, phraseKey, handleNextClick } = usePhraseSystem();
  const { sounds } = useSoundSystem();

  const throttledSetState = useRef(
    throttle((state) => {
      useGameStore.setState(state);
    }, 150),
  ).current;

  // const throttleDroneHeightHistory = useRef(
  //   throttle((state) => {
  //     useGameStore.setState(state);
  //   }, 150),
  // ).current;

  useEffect(() => {
    if (firstAppearing && !startStageFinished) {
      // console.log("sounds.landing", {firstAppearing, landing: sounds.landing});
      if (!disableSounds && sounds.landing) {
        sounds.landing.play();
      }
      // console.log("Drone mounted", firstAppearing);
    }
  }, [firstAppearing, sounds, disableSounds, startStageFinished]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleNextClick();
      }
    };

    if (educationMode) {
      window.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [educationMode, handleNextClick]);

  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();
    if (!ref.current) return;
    const { x, y, z } = useGameStore.getState().activePosition;
    const ease = 0.02;

    if (firstAppearing && time > 0.3) {
      ref.current.position.y +=
        (appearingHeightRef.current - ref.current.position.y) *
        (delta * 50) *
        ease;
      if (Math.abs(ref.current.position.y - appearingHeightRef.current) < 5) {
        setFirstAppearing(false);
        setMapAnimationState("enlarging");
      }
    } else {
      ref.current.position.x +=
        (x - ref.current.position.x) * (delta * 100) * ease;
      ref.current.position.y +=
        (y - appearingHeight - ref.current.position.y) * (delta * 100) * ease;
      ref.current.position.z +=
        (z - ref.current.position.z) * (delta * 100) * ease;

      // droneHeightHistoryRef.current.push(ref.current.position.y);

      // if (droneHeightHistoryRef.current.length > 10) {
      //   droneHeightHistoryRef.current.shift();
      //   // console.log("droneHeightHistoryRef", droneHeightHistoryRef.current);
      // }

      // throttleDroneHeightHistory({
      //   droneHeightHistory: droneHeightHistoryRef.current,
      // });

      droneDirectionAngleRef.current = Math.atan2(
        ref.current.position.x,
        ref.current.position.z,
      );

      throttledSetState({
        droneMoveAngle: Math.round(
          droneDirectionAngleRef.current * (180 / Math.PI),
        ),
      });

      // ref.current.rotation.y -= droneDirectionAngleRef.current;

      // if (droneVectorMovement.x !== ref.current.position.x || droneVectorMovement.y !== ref.current.position.y) {
      // useGameStore.setState({
      //   droneVectorMovement: {
      //     x: ref.current.position.x,
      //     y: ref.current.position.y,
      //   },
      // });
      // console.log("droneVectorMovement", droneVectorMovement);
      // }

      // if (droneVectorMovement.x !== 0 || droneVectorMovement.y !== 0) {
      //   ref.current.rotation.y = Math.atan2(
      //     droneVectorMovement.x,
      //     droneVectorMovement.y,
      // );
      // }
    }
  });

  return (
    <group position={[0, appearingHeight, 0]}>
      <group ref={ref}>
        <Float position={[0, 20, 0]} floatIntensity={10} speed={5}>
          <Drone />

          {!showSettingsModal && !showAboutModal && (
            <Billboard>
              <Html position={[4, 2, 0]}>
                {/* <div>
                  {droneDirectionAngleRef.current.toFixed(2) * (180 / Math.PI)}
                </div> */}

                {activePhrase.phrase !== "" && (
                  <div className="flex flex-col items-end">
                    <div
                      key={phraseKey}
                      className=" w-44 max-w-xs min-w-fit leading-4 text-uitext text-sm text-left border select-none border-uilines py-0.5 px-1 bg-black/80"
                    >
                      <TypingText text={activePhrase.phrase} speed={50} />
                    </div>
                    {activePhrase.skipped === false && (
                      <div className="flex flex-row justify-center items-center">
                        <p className=" text-xs opacity-60 mr-2 mt-1 select-none">
                          Or press Enter
                        </p>
                        <div
                          className="z-50 mt-1 text-sm text-uitext text-center py-0.5 px-1 bg-neutral-900 border border-uilines hover:bg-uilines hover:text-neutral-900 active:bg-uilines active:opacity-50 active:text-neutral-900 select-none cursor-pointer"
                          onClick={handleNextClick}
                        >
                          Next
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Html>
            </Billboard>
          )}
        </Float>
      </group>
    </group>
  );
};
