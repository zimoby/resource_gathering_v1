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
import { levaStore } from "leva";

const App = () => {
  // const toggleShowResources = useGamaStore((state) => state.toggleShowResources);
  const firstStart = useGamaStore((state) => state.firstStart);
  const loading = useGamaStore((state) => state.loading);

  const selectedResource = useGamaStore((state) => state.selectedResource);
  const selectedChunk = useGamaStore((state) => state.selectedChunk);
  const beacons = useGamaStore((state) => state.beacons);
  const message = useGamaStore((state) => state.message);

  const playerPoints = useGamaStore((state) => state.playerPoints);
  const collectedResources = useGamaStore((state) => state.collectedResources);

  useCalculateResources();
  useParamsSync();

  useEffect(() => {
    if (!loading && !firstStart) {
      useGamaStore.setState({ firstStart: true });
    }
    if (!loading && firstStart) {
      levaStore.set({ width: 100, depth: 100 });
      console.log("leva store updated");
    }
  }, [loading, firstStart]);

  return (
    <>
      <div className="orbitron z-50 fixed top-0 left-0 text-6xl">
        PLANET-01
      </div>
      <div className="scrollbar z-50 p-1 h-fit max-h-56 w-fit text-left m-2 text-xs fixed bottom-0 right-0 rounded-md border border-white/80">
        {beacons.map(
          (
            beacon: { chunk: { x: any; y: any }; resource: any; position: { x: any; z: any } },
            index: Key | null | undefined
          ) => (
            <div key={index}>
              {convertChunkCoordinateToName(beacon.chunk) + ": " + beacon.resource}
              {/* {`CH${beacon.chunk.x}${beacon.chunk.y}: ${beacon.resource}: ${beacon.position.x}, ${beacon.position.z}`} */}
              {/* {beacon.position.x}, {beacon.position.z} */}
            </div>
          )
        )}
      </div>
      {/* <div className="fixed left-1/2"> */}
      {/* <div className="z-50 fixed top-0 left-0">
        <button onClick={toggleShowResources}>Toggle Resource View</button>
      </div> */}
      {/* </div> */}
      <div className="z-50 flex fixed bottom-0 left-0 flex-col">
        <div>Selected Chunk: {convertChunkCoordinateToName(selectedChunk)}</div>
        <div>Selected Resource: {selectedResource}</div>
        {/* <div>Current Location: {JSON.stringify(currentLocation)}</div> */}
        <div className=" text-lg ">Player Points: {playerPoints}</div>
        {Object.entries(collectedResources).map(([resource, count]) => (
          <div key={resource}>
            {resource}: {count}
            </div> 
        ))}
      </div>
      <div className="z-50 fixed bottom-0 left-1/2">{message}</div>
      {/* <div className="w-full h-full border border-white p-2" /> */}
      {/* <div className=""> */}
        
        
      {/* </div> */}
      {/* <View className=" absolute m-1 w-200 h-100 overflow-hidden inline-block">
        <SpherePlanet />

        <ambientLight intensity={0.5} />
        <pointLight position={[20, 30, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="blue" />
        <PerspectiveCamera makeDefault fov={40} position={[0, 0, 6]} />

      </View> */}
      <Canvas flat shadows dpr={[1, 1.5]} gl={{ antialias: false }}>

        <Stats showPanel={2} />

        {/* <StatsGl /> */}
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
