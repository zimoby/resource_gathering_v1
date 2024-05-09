import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import useGamaStore from "../store";
import { getChunkCoordinates, useCalculateDeltas, useUpdateMapMoving } from "../functions/functions";
import { BasicGridShader } from "./BasicGridShader";
import { BeaconGroup } from "./beacons/BeaconGroup";
import { Terrain } from "./terrain/Terrain";

export const Map = () => {
  const firstStart = useGamaStore((state) => state.firstStart);
  const planeRef = useRef();
  const offset = useRef({ x: 0, y: 0 });

  const { deltaX, deltaY } = useCalculateDeltas();
  const { updateLocationAndOffset } = useUpdateMapMoving();

  console.log("Map rendering");
  
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
      <BasicGridShader planeRef={planeRef} />
    </group>
  );
};
