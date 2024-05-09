import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import useGamaStore from "../store";
import { getChunkCoordinates, useCalculateDeltas, useUpdateMapMoving } from "../functions/functions";
import { BeaconGroup } from "./beacons/BeaconGroup";
import { Terrain } from "./terrain/Terrain";
import { LinearGridShader } from "./LinearGridShader";
import { BasicGridShader } from "./BasicGridShader";
import { useControls } from "leva";


export const Map = () => {
  const firstStart = useGamaStore((state) => state.firstStart);
  const planeRef = useRef();
  const offset = useRef({ x: 0, y: 0 });
  const { width } = useGamaStore((state) => state.mapParams);

  const { rulerGridX, rulerGridY, sizeX, sizeY } = useControls({
    // sizeX: {
    //   value: 100, min: 1, max: 300, step: 1,
    // },
    // sizeY: {
    //   value: 100, min: 1, max: 300, step: 1,
    // },
    // rulerGridX: {
    //   value: 50, min: 1, max: 100, step: 1,
    // },
    rulerGridY: {
      value: 50, min: 1, max: 100, step: 1,
    },
  });

  const { deltaX, deltaY } = useCalculateDeltas();
  const { updateLocationAndOffset } = useUpdateMapMoving();

  // console.log("Map rendering");
  
  useFrame(() => {
    offset.current.x += deltaX;
    offset.current.y += deltaY;

    updateLocationAndOffset(offset);

    planeRef.current.material.uniforms.offset.value.set(offset.current.x * 0.01, -offset.current.y * 0.01);
  });

  return (
    <group visible={firstStart}>
      <BeaconGroup />
      <Terrain />
      {/* <TerrainVertex /> */}
      <group>
        <group position={[0,0,width / 2 + 4]}>
          <LinearGridShader position={[0,0,-1]} sizeX={width} sizeY={2} width={rulerGridY} depth={1} />
          <LinearGridShader position={[0,0,0]} sizeX={width} sizeY={5} width={rulerGridY / 2} depth={1} />
        </group>
        <group position={[0,0,-width / 2 - 4]} rotation-x={Math.PI}>
          <LinearGridShader position={[0,0,-1]} sizeX={width} sizeY={2} width={rulerGridY} depth={1} />
          <LinearGridShader position={[0,0,0]} sizeX={width} sizeY={5} width={rulerGridY / 2} depth={1} />
        </group>
        <group position={[width / 2 + 4,0,0]} rotation-y={Math.PI / 2}>
          <LinearGridShader position={[0,0,-1]} sizeX={width} sizeY={2} width={rulerGridY} depth={1} />
          <LinearGridShader position={[0,0,0]} sizeX={width} sizeY={5} width={rulerGridY / 2} depth={1} />
        </group>
        <group position={[-width / 2 - 4,0,0]} rotation-y={-Math.PI / 2}>
          <LinearGridShader position={[0,0,-1]} sizeX={width} sizeY={2} width={rulerGridY} depth={1} />
          <LinearGridShader position={[0,0,0]} sizeX={width} sizeY={5} width={rulerGridY / 2} depth={1} />
        </group>
      </group>

      <BasicGridShader planeRef={planeRef} />
    </group>
  );
};
