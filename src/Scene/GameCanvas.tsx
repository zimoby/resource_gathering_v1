import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import { Color } from "three";
import FlickeringEffect from "../effects/FlickeringEffect";
import useGamaStore from "../store";
import { ChunkGrid } from "../components/gfx/ChunkGrid";
import { CoordinatesKeys } from "../components/gfx/CoordinatesKeys";
import { PulsingCircle } from "../components/gfx/PulsingCircle";
import { EffectsCollection } from "./effects";
import { PlaneTest } from "../components/gfx/pulsingAreaTest";
import { SceneSettings } from "./scene";
import { Map } from "./Map";
import { FlyingDrone } from "../components/drone/Drone";

export const GameCanvas = () => {
  const firstStart = useGamaStore((state) => state.firstStart);

  return (
    <Canvas flat shadows dpr={[1, 1.5]} gl={{ antialias: false }}>
      <Stats showPanel={2} />
      {/* <Perf position="top-left" /> */}
      <SceneSettings />
      <Suspense fallback={null}>
        {/* <Viewcube /> */}
        <FlyingDrone />
        <Map />
        <CoordinatesKeys />
        <group position={[0, 0, 0]} visible={firstStart}>
          <FlickeringEffect initialIntensity={10} randomFrequency={0.008} duration={50}>
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
        <PlaneTest position={[0, -10, 0]} color={new Color(0x1586e9)} />
      </Suspense>
      <OrbitControls />
      <EffectsCollection />
    </Canvas>
  );
};

export default GameCanvas;
