import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import useGamaStore from "../store";
import { useCalculateDeltas, useUpdateMapMoving } from "../functions/functions";
import { BeaconGroup } from "./beacons/BeaconGroup";
import { Terrain } from "./terrain/Terrain";
import { LinearGridShader } from "./LinearGridShader1";
import { BasicGridShader } from "./BasicGridShader";
import { Mesh, ShaderMaterial } from "three";
import FlickeringEffect from "../animations/FlickeringEffect";
import FadingEffect from "../animations/FadingEffect";

export const Map = () => {
  const firstStart = useGamaStore((state) => state.firstStart);
  const planeRef = useRef<Mesh>(null);
  const offset = useRef({ x: 0, y: 0 });
  const { width, depth } = useGamaStore((state) => state.mapParams);

  // const { rulerGridY } = useControls({
  //   rulerGridY: {
  //     value: 50, min: 1, max: 100, step: 1,
  //   },
  // });

  const rulerGridY = 50;

  const { deltaX, deltaY } = useCalculateDeltas();
  const { updateLocationAndOffset } = useUpdateMapMoving();

  // console.log("Map rendering");
  
  useFrame(() => {
    offset.current.x += deltaX;
    offset.current.y += deltaY;

    updateLocationAndOffset(offset);

    if (planeRef.current && planeRef.current.material instanceof ShaderMaterial) {
      planeRef.current.material.uniforms.offset.value.set(offset.current.x * 0.01, -offset.current.y * 0.01);
    }
  });

  return (
    <group visible={firstStart}>
      <BeaconGroup />
      <FadingEffect>
        <Terrain />
      </FadingEffect>
      {/* <TerrainVertex /> */}
      <group position={[0,-1,0]}>
        <FlickeringEffect appearingOnly={true} initialIntensity={10} randomFrequency={0.008} duration={50}>
          <group position={[0,0,depth / 2 + 4]}>
            <LinearGridShader position={[0,0,-1]} sizeX={width} sizeY={2} width={rulerGridY / (100 / width)} depth={1} />
            <LinearGridShader position={[0,0,0]} sizeX={width} sizeY={5} width={rulerGridY / (100 / width) / 2} depth={1} />
          </group>
          <group position={[0,0,-depth / 2 - 4]} rotation-x={Math.PI}>
            <LinearGridShader position={[0,0,-1]} sizeX={width} sizeY={2} width={rulerGridY / (100 / width)} depth={1} />
            <LinearGridShader position={[0,0,0]} sizeX={width} sizeY={5} width={rulerGridY / (100 / width) / 2} depth={1} />
          </group>
          <group position={[width / 2 + 4,0,0]} rotation-y={Math.PI / 2}>
            <LinearGridShader position={[0,0,-1]} sizeX={depth} sizeY={2} width={rulerGridY / (100 / depth)} depth={1} />
            <LinearGridShader position={[0,0,0]} sizeX={depth} sizeY={5} width={rulerGridY / (100 / depth) / 2} depth={1} />
          </group>
          <group position={[-width / 2 - 4,0,0]} rotation-y={-Math.PI / 2}>
            <LinearGridShader position={[0,0,-1]} sizeX={depth} sizeY={2} width={rulerGridY / (100 / depth)} depth={1} />
            <LinearGridShader position={[0,0,0]} sizeX={depth} sizeY={5} width={rulerGridY / (100 / depth) / 2} depth={1} />
          </group>
        </FlickeringEffect>
      </group>

      <BasicGridShader planeRef={planeRef} position={[0,0,0]} />
    </group>
  );
};
