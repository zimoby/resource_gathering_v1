import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../store";
import { useCalculateDeltas, useUpdateMapMoving } from "../utils/functions";
import { BeaconGroup } from "../components/beacons/BeaconGroup";
import { Terrain } from "../components/terrain/Terrain";
import { LinearGridShader } from "../components/gfx/LinearGridShader1";
import { BasicGridShader } from "../components/gfx/BasicGridShader";
import { Color, Mesh, ShaderMaterial } from "three";
import { FlickeringEffect } from "../effects/FlickeringEffectWrapper";
import { FadingEffect } from "../effects/FadingEffectWrapper";
import { useIncreasingSpeed, useIncreasingSpeed2 } from "../effects/IncreaseSceneSpeed";
import { PlaneTest } from "../components/gfx/pulsingAreaTest";

const rulerGridY = 50;

export const Map = () => {
  const firstStart = useGameStore((state) => state.firstStart);
  const planeRef = useRef<Mesh>(null);
  const offset = useRef({ x: 0, y: 0 });
  const { width, depth } = useGameStore((state) => state.mapParams);

  const updateMapSize = useGameStore((state) => state.updateMapSize);
  const animationFirstStage = useGameStore((state) => state.animationFirstStage);

  const { deltaX, deltaY } = useCalculateDeltas();
  const { speedRef: increasingSpeedRef } = useIncreasingSpeed(0, 1, 0.01, 2);
  const { valueAnimation, valueReached, valueStarted } = useIncreasingSpeed2(0, 100, 1, 2);
  const { updateLocationAndOffset } = useUpdateMapMoving();

  useFrame(() => {

    if (!valueReached.current && valueStarted.current) {
      useGameStore.setState({ terrainAppearing: true });
      updateMapSize(valueAnimation.value.get());
    } else if (valueReached.current && !animationFirstStage) {
      // console.log("valueReached.current:", valueReached.current);
      useGameStore.setState({ animationFirstStage: true });
    }
    

    offset.current.x += deltaX * increasingSpeedRef.current;
    offset.current.y += deltaY * increasingSpeedRef.current;

    // if (now - lastExecution.current > updateInterval) {
    //   lastExecution.current = now;
      updateLocationAndOffset(offset);
    // }
    
    if (planeRef.current && planeRef.current.material instanceof ShaderMaterial && planeRef.current.material.uniforms.offset && planeRef.current.material.uniforms.offset.value) {
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
      <PlaneTest position={[0, -12, 0]} color={new Color(0x1586e9)} />
    </group>
  );
};
