import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import useGamaStore from "../store";
import { ConcentricCirclesAnimation } from "./concentricCircles";

// const convertChunkCoordinateToName = (chunk: { x: any; y: any }) => {
//   return `CH${chunk.x}${chunk.y}`;
// }
export const PulsingCircle = () => {
  const activePosition = useGamaStore((state) => state.activePosition);
  const canPlaceBeacon = useGamaStore((state) => state.canPlaceBeacon);
  const ref = useRef();
  const size = 10;

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    // console.log("ref.current:", ref.current);
    if (ref.current) {
      ref.current.material.uniforms.uTime.value = time;
    }
  });

  return (
    <group visible={canPlaceBeacon} position={[activePosition.x, activePosition.y, activePosition.z]}>
      <ConcentricCirclesAnimation />
      {/* <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
              <circleGeometry args={[size, 32]} />
              <pulsingShaderMaterial
                ref={ref}
                uTime={0}
                uColor={new Color(0xffffff)}
                uFrequency={10}
                uAmplitude={0.5}
                uOpacity={0.5}
              />
            </mesh> */}
    </group>
  );
};
