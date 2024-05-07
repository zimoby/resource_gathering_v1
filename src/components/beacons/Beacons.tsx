import { Cylinder, Sphere } from "@react-three/drei";
import { useControls } from "leva";
import useGamaStore from "../../store";
import { ConcentricCirclesAnimation } from "../concentricCircles";
import { isOutOfBound } from "../../functions/functions";

export const Beacons = () => {
  const beacons = useGamaStore((state) => state.beacons);
  const beaconHeight = 10;
  const mapParams = useGamaStore((state) => state.mapParams);

  return (
    <>
      {beacons.map(
        (
          beacon: { position: { x: any; y: any; z: any; }; visible: any; },
          index: string | number | bigint | undefined
        ) => {
          const position = {
            x: beacon.position.x,
            y: beacon.position.y,
            z: beacon.position.z,
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
