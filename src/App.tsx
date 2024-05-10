import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import useGamaStore from "./store";

import { EffectsCollection } from "./components/effects";

import { PulsingCircle } from "./components/PulsingCircle";
import { Map } from "./components/Map";
import { ChunkGrid } from "./components/ChunkGrid";
import { useCalculateResources } from "./functions/calculateResources";
import { CoordinatesKeys } from "./components/CoordinatesKeys";
import { SceneSettings } from "./components/scene";
import { useParamsSync } from "./functions/paramsSync";
import { BeaconsInfo } from "./components/beacons/BeaconsInfo";
import { UiInfo } from "./components/uiInfo";
import { useInitInfo } from "./components/initInfo";
import FlickeringEffect from "./animations/FlickeringEffect";
import { useGameLoop } from "./components/GameLoop";

// import FadingEffect from "./animations/FadingEffect";

const App = () => {
  const firstStart = useGamaStore((state) => state.firstStart)

  useInitInfo();
  useCalculateResources();
  useParamsSync();
  useGameLoop();

  return (
    <>
      <UiInfo />
      <BeaconsInfo />

      <Canvas flat shadows dpr={[1, 1.5]} gl={{ antialias: false }}>
        <Stats showPanel={2} />
        {/* <Perf position="top-left" /> */}
        <SceneSettings />
        <Suspense fallback={null}>
          {/* <Viewcube /> */}
          <Map />
          <CoordinatesKeys />

          {/* <GridMetricUnits /> */}

          <group position={[0, 0, 0]} visible={firstStart}>
            <FlickeringEffect initialIntensity={10} randomFrequency={0.008} duration={50}>
              <ChunkGrid position={[0,0,0]} sizeExtend={1} />
              <ChunkGrid position={[0,-10,0]} sizeExtend={1} />
              <ChunkGrid position={[0,-10,0]} sizeExtend={10} />
            </FlickeringEffect>
          </group>
          {/* <Beacons /> */}
          {/* <FadingEffect> */}
            <PulsingCircle />
          {/* </FadingEffect> */}
        </Suspense>

        {/* <ChunkGrid position={[0,-10,0]} /> */}
        {/* <PlaneTest /> */}
        {/* <ConcentricCirclesAnimation /> */}
        {/* <mesh position={[0,-12,0]} rotation-x={Math.PI / 2}>
          <planeGeometry args={[100,100]} />
          <meshBasicMaterial color={0x0000ff} side={DoubleSide} />
        </mesh> */}
        <OrbitControls />
        
        <EffectsCollection />
        {/* <Html> */}
        {/* </Html> */}
      </Canvas>
          

    </>
  );
};

export default App;
