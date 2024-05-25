import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import { FlickeringEffect } from "../effects/FlickeringEffectWrapper";
import { useGameStore } from "../store/store";
import { ChunkGrid } from "../components/gfx/ChunkGrid";
import { CoordinatesKeys } from "../components/gfx/CoordinatesKeys";
import { PulsingCircle } from "../components/gfx/PulsingCircle";
import { EffectsCollection } from "./effects";
import { SceneSettings } from "./scene";
import { Map } from "./Map";
import { FlyingDrone } from "../components/drone/Drone";
import { Line } from "../components/gfx/Line";
import { Euler } from "three";
import { CenterScreenPanel } from "../components/UI/Panels/CenterScreenPanel";
import { ArtifactsPlanesIndicators } from "../components/artifacts/ArtifactsIndicators";
// import { Perf } from "r3f-perf";

export const GameCanvas = () => {
  const firstStart = useGameStore((state) => state.firstStart);
  const animationFirstStage = useGameStore((state) => state.animationFirstStage);
  const terrainAppearing = useGameStore((state) => state.terrainAppearing);

  return (
    <Canvas flat shadows dpr={[1, 1.5]} gl={{ antialias: false }}>
      <Stats showPanel={2} />
      {/* <Perf position="bottom-left" /> */}
      <SceneSettings />
      <Suspense fallback={null}>
        <group position={[0,0,0]}>
          <FlyingDrone />
          <Map />
          {animationFirstStage && <group position={[0, 0, 0]} visible={animationFirstStage}>
            <CoordinatesKeys />
            <ArtifactsPlanesIndicators />
          </group>}
          <group position={[0, 0, 0]} visible={firstStart}>
            <FlickeringEffect initialIntensity={10} randomFrequency={0.008} duration={50}>
              <ChunkGrid position={[0, 0, 0]} sizeExtend={1} />
              <ChunkGrid position={[0, -10, 0]} sizeExtend={1} />
              <ChunkGrid position={[0, -10, 0]} sizeExtend={10} />
            </FlickeringEffect>

            {!terrainAppearing &&
              <FlickeringEffect initialIntensity={10} randomFrequency={0.008} duration={50}>
                <Line width={100} />
                <Line width={100} rotation={new Euler(0,Math.PI/2,0)} />
                <ChunkGrid position={[0, -1, 0]} sizeExtend={30} />
              </FlickeringEffect>
            }
          </group>
          <PulsingCircle />
        </group>
      </Suspense>
      <CenterScreenPanel />
      <OrbitControls enablePan={false} minZoom={4} maxZoom={15} />
      <EffectsCollection />
    </Canvas>
  );
};

export default GameCanvas;
