import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import useGamaStore from "../store";
import { getChunkCoordinates } from "../functions/functions";
import { BasicGridShader } from "./BasicGridShader";
import { BeaconGroup } from "./beacons/BeaconGroup";
import { Terrain } from "./terrain/Terrain";

export const Map = () => {
  const firstStart = useGamaStore((state) => state.firstStart);
  const dynamicSpeed = useGamaStore((state) => state.dynamicSpeed);
  const { width, depth, offsetX, offsetY, speed } = useGamaStore((state) => state.mapParams);
  const direction = useGamaStore((state) => state.moveDirection);
  const planeRef = useRef();
  const offset = useRef({ x: 0, y: 0 });

  const deltaX = direction.x * (speed * dynamicSpeed);
  const deltaY = direction.y * (speed * dynamicSpeed);

  // console.log("Map rendering");
  
  useFrame(() => {
    offset.current.x += deltaX;
    offset.current.y += deltaY;

    const currentChunk = getChunkCoordinates(
      offset.current.x + offsetX + width / 2,
      offset.current.y + offsetY + depth / 2,
      width
    );
    
    useGamaStore.setState({
      currentLocation: { x: currentChunk.x, y: currentChunk.y },
      currentOffset: { x: offset.current.x, y: offset.current.y },
    });

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
