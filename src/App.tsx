import { useEffect, Key, useMemo, Suspense, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Box, Center, Html, Hud, OrbitControls, OrthographicCamera, PerspectiveCamera, Sphere, Stats, StatsGl, Text, View } from "@react-three/drei";
import useGamaStore, { resourceTypes } from "./store";

import { EffectsCollection } from "./components/effects";

import { convertChunkCoordinateToName } from "./functions/functions";
import { PulsingCircle } from "./components/PulsingCircle";
import { Terrain } from "./components/Terrain";
import { ChunkGrid } from "./components/ChunkGrid";
import { Beacons } from "./components/beacons/Beacons";
import { useCalculateResources } from "./functions/calculateResources";
import { CoordinatesKeys, GridMetricUnits } from "./components/CoordinatesKeys";
import { SceneSettings } from "./components/scene";
import { useParamsSync } from "./functions/paramsSync";
import { BeaconsInfo } from "./components/beacons/BeaconsInfo";
import { UiInfo } from "./components/uiInfo";
import { useInitInfo } from "./components/initInfo";

const App = () => {
  const firstStart = useGamaStore((state) => state.firstStart)

  useInitInfo();
  useCalculateResources();
  useParamsSync();

  return (
    <>
      <UiInfo />
      <BeaconsInfo />

      <Canvas flat shadows dpr={[1, 1.5]} gl={{ antialias: false }}>
        <Stats showPanel={2} />
        <SceneSettings />
        <Suspense fallback={null}>
          {/* <Viewcube /> */}
          <Terrain />
          <CoordinatesKeys />

          {/* <GridMetricUnits /> */}

          <group position={[0, 0, 0]} visible={firstStart}>
            <ChunkGrid position={[0,0,0]} sizeExtend={1} />
            <ChunkGrid position={[0,-10,0]} sizeExtend={1} />
            <ChunkGrid position={[0,-10,0]} sizeExtend={10} />
          </group>
          <Beacons />
          <PulsingCircle />
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
