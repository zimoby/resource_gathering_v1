import { Cylinder, Sphere } from "@react-three/drei";
import { useControls } from "leva";
import useGamaStore from "../../store";
import { ConcentricCirclesAnimation } from "../concentricCircles";
import { isOutOfBound } from "../../functions/functions";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export const Beacons = () => {
  const beacons = useGamaStore((state) => state.beacons);
  const beaconHeight = 10;
  const mapParams = useGamaStore((state) => state.mapParams);
  const beaconsRef = useRef([]);

  // console.log("Beacons:", beacons);

  const currentOffset = useGamaStore((state) => state.currentOffset);

  useEffect(() => {
    beaconsRef.current = beacons.map((beacon) => ({
      ...beacon,
      visible: true,
    }));
  }, [beacons]);

  useFrame(({ clock }) => {
    beaconsRef.current.forEach((beacon) => {
      beacon.testx = (beacon.x - currentOffset.x * (beacon.chunkX )) ;
      beacon.testz = (beacon.y - currentOffset.y * (beacon.chunkY ));
      beacon.visible = !isOutOfBound(
        { x: beacon.testx, y: beacon.y, z: beacon.testz },
        mapParams.width,
        mapParams.depth,
        mapParams.offsetX,
        mapParams.offsetY
      );

    });
  });

  return (
    <>
      {beaconsRef.current.map((beacon, index) => {
        const position = {
          x: beacon.testx,
          y: beacon.y,
          z: beacon.testz,
        };

        return (
          beacon.visible && (
            <group
              key={index}
              position={[
                position.x - mapParams.offsetX,
                position.y,
                position.z - mapParams.offsetY,
              ]}
            >
              <Sphere args={[1, 8, 8]} position={[0, beaconHeight, 0]} />
              <Cylinder
                args={[0.1, 0.1, beaconHeight, 4]}
                position={[0, beaconHeight / 2, 0]}
              />
              <ConcentricCirclesAnimation />
            </group>
          )
        );
      })}
    </>
  );
};