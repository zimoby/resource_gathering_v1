import { useGameStore } from "../../store";
import { ConcentricCirclesAnimation } from "./concentricCircles";

export const PulsingCircle = () => {
  const activePosition = useGameStore((state) => state.activePosition);
  const canPlaceBeacon = useGameStore((state) => state.canPlaceBeacon);

  return (
    <group visible={canPlaceBeacon} position={[activePosition.x, activePosition.y - 1, activePosition.z]}>
      <ConcentricCirclesAnimation size={10} />
    </group>
  );
};
