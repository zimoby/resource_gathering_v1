import { Text } from "@react-three/drei";
import { useCheckComponentRender } from "../../utils/functions";
import { useGameStore } from "../../store";
import FadingEffect from "../../effects/FadingEffect";
import { ChunkName } from "./chunkText";

const lightColor = "#afafaf";
const redColor = "#8b0000";

export const CoordinatesKeys = () => {
  const { width, depth } = useGameStore((state) => state.mapParams);
  const speed = useGameStore((state) => state.mapParams.speed);
  const disableAnimations = useGameStore((state) => state.disableAnimations);

  const moveDirection = useGameStore((state) => state.moveDirection);

  // useCheckComponentRender("CoordinatesKeys");

  return (
    <group position={[0, 0.3, 0]}>
      <FadingEffect disabled={disableAnimations} randomFrequency={0.2} minOpacity={0.8}>
        <Text
          position={[-width / 2 - 2, 0, depth / 2]}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          font="/Orbitron-Bold.ttf"
          fontSize={9}
          fontWeight={"bold"}
          color={(moveDirection.x === -1 && moveDirection.y === 0) && speed > 0 ? redColor : lightColor}
          anchorX="left"
          anchorY="top"
        >
          A
        </Text>
        <Text
          position={[width / 2 + 2, 0, -depth / 2]}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          font="/Orbitron-Bold.ttf"
          fontSize={10}
          fontWeight={"bold"}
          color={(moveDirection.x === 1 && moveDirection.y === 0) && speed > 0 ? redColor : lightColor}
          anchorX="right"
          anchorY="bottom"
        >
          D
        </Text>
        <Text
          position={[-width / 2, 0, -depth / 2 - 2]}
          rotation={[-Math.PI / 2, 0, 0]}
          font="/Orbitron-Bold.ttf"
          fontSize={8}
          fontWeight={"bold"}
          color={(moveDirection.x === 0 && moveDirection.y === -1) && speed > 0 ? redColor : lightColor}
          anchorX="left"
          anchorY="top"
        >
          W
        </Text>
        <Text
          position={[width / 2, 0, depth / 2 + 2]}
          rotation={[-Math.PI / 2, 0, 0]}
          font="/Orbitron-Bold.ttf"
          fontSize={11}
          fontWeight={"bold"}
          color={(moveDirection.x === 0 && moveDirection.y === 1) && speed > 0 ? redColor : lightColor}
          anchorX="right"
          anchorY="bottom"
        >
          S
        </Text>
        <ChunkName />

      </FadingEffect>
    </group>
  );
};
