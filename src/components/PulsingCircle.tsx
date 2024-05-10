import useGamaStore from "../store";
import { ConcentricCirclesAnimation } from "./concentricCircles";

export const PulsingCircle = () => {
  const activePosition = useGamaStore((state) => state.activePosition);
  const canPlaceBeacon = useGamaStore((state) => state.canPlaceBeacon);

  // const ref = useRef<ShaderMaterial | null>(null);

  // useFrame(({ clock }) => {
  //   const time = clock.getElapsedTime();
  //   if (ref.current) {
  //     ref.current.uniforms.uTime.value = time;
  //   }
  // });

  return (
    <group visible={canPlaceBeacon} position={[activePosition.x, activePosition.y - 1, activePosition.z]}>
      <ConcentricCirclesAnimation size={10} />
    </group>
  );
};
