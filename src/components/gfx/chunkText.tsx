import { Text } from "@react-three/drei";
import { convertChunkCoordinateToName, useCheckComponentRender } from "../../utils/functions";
import { useMemo } from "react";
import { useGameStore } from "../../store";

const lightColor = "#afafaf";

export const ChunkName = () => {
  const { width, depth } = useGameStore((state) => state.mapParams);

  const currentLocation = useGameStore((state) => state.currentLocation);

  const currentChunkName = useMemo(() => {
    return convertChunkCoordinateToName(currentLocation);
  }, [currentLocation]);

//   console.log("currentChunkName", currentChunkName);

  return (
    <Text
        position={[width / 2 - 1, 0, depth / 2 + 2]}
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
