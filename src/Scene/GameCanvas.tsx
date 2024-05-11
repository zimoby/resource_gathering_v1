import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import FlickeringEffect from "../effects/FlickeringEffect";
import { useGameStore } from "../store";
import { ChunkGrid } from "../components/gfx/ChunkGrid";
import { CoordinatesKeys } from "../components/gfx/CoordinatesKeys";
import { PulsingCircle } from "../components/gfx/PulsingCircle";
import { EffectsCollection } from "./effects";
import { SceneSettings } from "./scene";
import { Map } from "./Map";
import { FlyingDrone } from "../components/drone/Drone";

export const GameCanvas = () => {
  const firstStart = useGameStore((state) => state.firstStart);
  const animationFirstStage = useGameStore((state) => state.animationFirstStage);
  const disableAnimations = useGameStore((state) => state.disableAnimations);

  return (
    <Canvas flat shadows dpr={[1, 1.5]} gl={{ antialias: false }}>
      <Stats showPanel={2} />
      {/* <Perf position="top-left" /> */}
      <SceneSettings />
      <Suspense fallback={null}>
        {/* <Viewcube /> */}
        <FlyingDrone />
        <Map />
        {animationFirstStage && <group position={[0, 0, 0]} visible={animationFirstStage}>
          <CoordinatesKeys />
        </group>}
        <group position={[0, 0, 0]} visible={firstStart}>
          <FlickeringEffect disabled={disableAnimations} initialIntensity={10} randomFrequency={0.008} duration={50}>
            <ChunkGrid position={[0, 0, 0]} sizeExtend={1} />
            <ChunkGrid position={[0, -10, 0]} sizeExtend={1} />
            <ChunkGrid position={[0, -10, 0]} sizeExtend={10} />
          </FlickeringEffect>
        </group>
        {/* <Beacons /> */}
        {/* <FadingEffect randomFrequency={1}> */}
        {/* <group> */}
        <PulsingCircle />
        {/* </group> */}
        {/* </FadingEffect> */}
      </Suspense>
      <OrbitControls />
      <EffectsCollection />
    </Canvas>
  );
};

export default GameCanvas;
