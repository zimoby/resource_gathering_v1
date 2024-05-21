import { FlickeringEffect } from "../../effects/FlickeringEffectWrapper";
import { useGameStore } from "../../store/store";
import { LinearGridShader } from "./LinearGridShader1";

const rulerGridY = 50;

export const RulersFourSides = () => {
  const firstStart = useGameStore((state) => state.firstStart);
  const { width, depth } = useGameStore((state) => state.mapParams);

  return (
    <group visible={firstStart} position={[0, -1, 0]}>
      <FlickeringEffect
        appearingOnly={true}
        initialIntensity={10}
        randomFrequency={0.008}
        duration={50}
      >
        <group position={[0, 0, depth / 2 + 4]}>
          <LinearGridShader
            position={[0, 0, -1]}
            sizeX={width}
            sizeY={2}
            width={rulerGridY / (100 / width)}
            depth={1}
          />
          <LinearGridShader
            position={[0, 0, 0]}
            sizeX={width}
            sizeY={5}
            width={rulerGridY / (100 / width) / 2}
            depth={1}
          />
        </group>
        <group position={[0, 0, -depth / 2 - 4]} rotation-x={Math.PI}>
          <LinearGridShader
            position={[0, 0, -1]}
            sizeX={width}
            sizeY={2}
            width={rulerGridY / (100 / width)}
            depth={1}
          />
          <LinearGridShader
            position={[0, 0, 0]}
            sizeX={width}
            sizeY={5}
            width={rulerGridY / (100 / width) / 2}
            depth={1}
          />
        </group>
        <group position={[width / 2 + 4, 0, 0]} rotation-y={Math.PI / 2}>
          <LinearGridShader
            position={[0, 0, -1]}
            sizeX={depth}
            sizeY={2}
            width={rulerGridY / (100 / depth)}
            depth={1}
          />
          <LinearGridShader
            position={[0, 0, 0]}
            sizeX={depth}
            sizeY={5}
            width={rulerGridY / (100 / depth) / 2}
            depth={1}
          />
        </group>
        <group position={[-width / 2 - 4, 0, 0]} rotation-y={-Math.PI / 2}>
          <LinearGridShader
            position={[0, 0, -1]}
            sizeX={depth}
            sizeY={2}
            width={rulerGridY / (100 / depth)}
            depth={1}
          />
          <LinearGridShader
            position={[0, 0, 0]}
            sizeX={depth}
            sizeY={5}
            width={rulerGridY / (100 / depth) / 2}
            depth={1}
          />
        </group>
      </FlickeringEffect>
    </group>
  );
};
