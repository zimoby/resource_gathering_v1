import { Cylinder, Sphere } from "@react-three/drei";
import { useControls } from "leva";
import useGamaStore from "../../store";
import { ConcentricCirclesAnimation } from "../concentricCircles";
import { isOutOfBound } from "../../functions/functions";
import { useEffect } from "react";

export const Beacons = () => {
  const beacons = useGamaStore((state) => state.beacons);
  const beaconHeight = 10;
  const mapParams = useGamaStore((state) => state.mapParams);

  // useEffect(() => {
  //   console.log("Beacons updated", beacons);
  // }, [beacons]);

  return (
    <>
      {beacons.map(
        (
          beacon: { x: number; y: number; z: number; visible: boolean; },
          index: string | number
        ) => {
          const position = {
            x: beacon.x,
            y: beacon.y,
            z: beacon.z,
          };

          const isVisible = beacon.visible && !isOutOfBound(position, mapParams.width, mapParams.depth, mapParams.offsetX, mapParams.offsetY);

          return (
            isVisible && (
              <group
                key={index}
                position={[position.x - mapParams.offsetX, position.y, position.z - mapParams.offsetY]}
              >
                <Sphere args={[1, 8, 8]} position={[0, beaconHeight, 0]} />
                <Cylinder args={[0.1, 0.1, beaconHeight, 4]} position={[0, beaconHeight / 2, 0]} />
                <ConcentricCirclesAnimation />
              </group>
            )
          );
        }
      )}
    </>
  );
};
