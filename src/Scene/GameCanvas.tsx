import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Billboard, Html, OrbitControls, Ring, Sphere, Stats } from "@react-three/drei";
import FlickeringEffect from "../effects/FlickeringEffectWrapper";
import { useGameStore } from "../store";
import { ChunkGrid } from "../components/gfx/ChunkGrid";
import { CoordinatesKeys } from "../components/gfx/CoordinatesKeys";
import { PulsingCircle } from "../components/gfx/PulsingCircle";
import { EffectsCollection } from "./effects";
import { SceneSettings } from "./scene";
import { Map } from "./Map";
import { FlyingDrone } from "../components/drone/Drone";
import { Line } from "../components/gfx/Line";
import { DoubleSide, Euler } from "three";

export const GameCanvas = () => {
  const firstStart = useGameStore((state) => state.firstStart);
  const animationFirstStage = useGameStore((state) => state.animationFirstStage);
  const disableAnimations = useGameStore((state) => state.disableAnimations);
  const terrainAppearing = useGameStore((state) => state.terrainAppearing);

  return (
    <Canvas flat shadows dpr={[1, 1.5]} gl={{ antialias: false }}>
      <Stats showPanel={2} />
      {/* <Perf position="top-left" /> */}
      <SceneSettings />
      <Suspense fallback={null}>
        <group position={[0,0,0]}>
          {/* <Viewcube /> */}
          <FlyingDrone />
          <Map />
          {animationFirstStage && <group position={[0, 0, 0]} visible={animationFirstStage}>
            <CoordinatesKeys />
          </group>}
          {/* <Ring args={[100, 120, 4]} position={[0, -5, 0]} rotation={[Math.PI / 2, 0, Math.PI / 4]}>
            <meshBasicMaterial color="pink" opacity={0.01} transparent side={DoubleSide} />
          </Ring> */}
          {/* <Sphere args={[10, 8, 8]} position={[0, 0, 0]}>
            <meshBasicMaterial color="red" />
          </Sphere> */}
          <group position={[0, 0, 0]} visible={firstStart}>
            <FlickeringEffect disabled={disableAnimations} initialIntensity={10} randomFrequency={0.008} duration={50}>
              <ChunkGrid position={[0, 0, 0]} sizeExtend={1} />
              <ChunkGrid position={[0, -10, 0]} sizeExtend={1} />
              <ChunkGrid position={[0, -10, 0]} sizeExtend={10} />
              {/* {!animationFirstStage && <ChunkGrid position={[0, -10, 0]} sizeExtend={30} />}
              {!animationFirstStage && <ChunkGrid position={[0, -10, 0]} sizeExtend={60} />}
              {!animationFirstStage && <ChunkGrid position={[0, -10, 0]} sizeExtend={65} />}
            {!animationFirstStage && <ChunkGrid position={[0, -10, 0]} sizeExtend={80} />} */}
            </FlickeringEffect>

            {!terrainAppearing &&
              <FlickeringEffect disabled={disableAnimations} initialIntensity={10} randomFrequency={0.008} duration={50}>
                <Line width={100} />
                <Line width={100} rotation={new Euler(0,Math.PI/2,0)} />
                <ChunkGrid position={[0, -1, 0]} sizeExtend={30} />
              </FlickeringEffect>
            }
          </group>
          {/* <Beacons /> */}
          {/* <FadingEffect randomFrequency={1}> */}
          {/* <group> */}
          <PulsingCircle />
          {/* </group> */}
          {/* </FadingEffect> */}

        </group>
      </Suspense>
      <Billboard>
        <Html>
          <div
            className="fixed -z-10 border"
            style={{
              width: "calc(100vw - 25.5rem)",
              height: "calc(100vh - 13.5rem)",
              top: "calc(-50vh + 4.75rem)",
              left: "calc(-50vw + 12.75rem)"
            }}
            // onClick={(e) => e.stopPropagation()}
          />
        </Html>
      </Billboard>
      <OrbitControls />
      <EffectsCollection />
    </Canvas>
  );
};

export default GameCanvas;
