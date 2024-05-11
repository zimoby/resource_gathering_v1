import { Plane } from "@react-three/drei";
import { useGameStore } from "../../store";
import { DoubleSide } from "three";


export const GridMetricUnits = () => {
  const { width, depth } = useGameStore((state) => state.mapParams);

  return (
    <mesh position={[0, 1, 0]} rotation-x={Math.PI / 2}>
      <Plane args={[width + 2, depth + 2]}>
        <meshBasicMaterial color={"#000000"} side={DoubleSide} />
      </Plane>
    </mesh>
  );
};
