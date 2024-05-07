import { Plane, Text } from "@react-three/drei";
import { useControls } from "leva";
import { convertChunkCoordinateToName } from "../functions/functions";
import { useMemo } from "react";
import useGamaStore from "../store";
import { DoubleSide } from "three";

export const GridMetricUnits = () => {
  const { width, depth } = useControls({
    width: { value: 100, min: 1, max: 200 },
    depth: { value: 100, min: 1, max: 200 },
  });

  return (
    <mesh position={[0, 1, 0]} rotation-x={Math.PI / 2}>
      <Plane args={[width + 2, depth + 2]}>
        <meshBasicMaterial color={"#000000"} side={DoubleSide} />
      </Plane>
    </mesh>
  )
}


export const CoordinatesKeys = () => {
  const { width, depth } = useControls({
    width: { value: 100, min: 1, max: 200 },
    depth: { value: 100, min: 1, max: 200 },
  });

  const currentLocation = useGamaStore((state) => state.currentLocation);

  const currentChunkName = useMemo(() => {
    return convertChunkCoordinateToName(currentLocation);
  }, [currentLocation]);

  return (
    <group position={[0, 0, 0]}>
      <Text
        position={[-width / 2 - 2, 0, depth / 2]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        font="/Orbitron-Bold.ttf"
        fontSize={9}
        fontWeight={"bold"}
        color={"#afafaf"}
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
        color={"#afafaf"}
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
        color={"#afafaf"}
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
        color={"#afafaf"}
        anchorX="right"
        anchorY="bottom"
      >
        S
      </Text>

      
      <Text
        position={[width / 2 - 1, 0, depth / 2 + 2]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        font="/Orbitron-Bold.ttf"
        fontSize={12}
        color={"#afafaf"}
        anchorX="left"
        anchorY="top"
      >
        {currentChunkName}
      </Text>
    </group>
  );
};
