import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import useGamaStore from "../store";
import { ConcentricCirclesAnimation } from "./concentricCircles";

export const PulsingCircle = () => {
  const activePosition = useGamaStore((state) => state.activePosition);
  const canPlaceBeacon = useGamaStore((state) => state.canPlaceBeacon);
  const ref = useRef();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (ref.current) {
      ref.current.material.uniforms.uTime.value = time;
    }
  });

  return (
    <group visible={canPlaceBeacon} position={[activePosition.x, activePosition.y - 1, activePosition.z]}>
      <ConcentricCirclesAnimation size={10} />
    </group>
  );
};
