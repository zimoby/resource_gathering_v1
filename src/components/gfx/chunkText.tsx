import { Text } from "@react-three/drei";
import { convertChunkCoordinateToName } from "../../utils/functions";
import { useMemo } from "react";
import { useGameStore } from "../../store/store";

const lightColor = "#afafaf";

export const ChunkName = () => {
  const { width, depth } = useGameStore((state) => state.mapParams);

  const currentLocation = useGameStore((state) => state.currentLocation);
  const mapAnimationState = useGameStore((state) => state.mapAnimationState);

  const currentChunkName = useMemo(() => {
    return convertChunkCoordinateToName(currentLocation);
  }, [currentLocation]);

  return (
    <Text
      visible={mapAnimationState === "idle"}
      position={[width / 2 + 12, 0.5, depth / 2 + 2]}
      rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      font="/Orbitron-Bold.ttf"
      fontSize={12}
      color={lightColor}
      anchorX="left"
      anchorY="top"
    >
      {currentChunkName}
    </Text>
  );
};
