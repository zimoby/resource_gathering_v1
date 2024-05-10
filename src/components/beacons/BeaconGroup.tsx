import useGamaStore from "../../store";
import { Cylinder, Sphere } from "@react-three/drei";
import { ConcentricCirclesAnimation } from "../concentricCircles";
import { useFrame } from "@react-three/fiber";
import { isOutOfBound, useCalculateDeltas } from "../../functions/functions";
import { createRef, useLayoutEffect, useRef } from "react";
import { Group } from "three";

export const BeaconGroup = () => {
  const firstStart = useGamaStore((state) => state.firstStart);
  const beacons = useGamaStore((state) => state.beacons);
  const { width, depth, offsetX, offsetY } = useGamaStore((state) => state.mapParams);
  const { deltaX, deltaY } = useCalculateDeltas();

  const beaconRefs = useRef<React.RefObject<Group>[]>(beacons.map(() => createRef()));

  const beaconHeight = 10;

  // console.log("beacons:", beacons);

  useLayoutEffect(() => {
    beaconRefs.current = beaconRefs.current.slice(0, beacons.length);
    for (let i = beaconRefs.current.length; i < beacons.length; i++) {
        beaconRefs.current[i] = createRef();
    }
    console.log("beaconRefs:", beaconRefs.current);
}, [beacons.length]);

  useFrame(() => {
    beaconRefs.current.forEach((beacon) => {
      const beaconObject = beacon.current;
      // console.log("beaconObject.position:", beaconObject);
      if (beaconObject) {
        const checkBoundaries = isOutOfBound({x: beaconObject.position.x, y: beaconObject.position.z}, width, depth, offsetX, offsetY);

        beaconObject.position.x -= deltaX;
        beaconObject.position.z -= deltaY;

        beaconObject.visible = !checkBoundaries.x && !checkBoundaries.y;
      }
    });
  });

  return (
    <group visible={firstStart}>
      {beacons.map((beacon, index) => (
        <group key={beacon.id}>
          <group position={[beacon.x, beacon.y, beacon.z]} ref={beaconRefs.current[index]}>
            <Sphere args={[1, 8, 8]} position={[0, beaconHeight, 0]} />
            <Cylinder args={[0.1, 0.1, beaconHeight, 4]} position={[0, beaconHeight / 2, 0]} />
            <ConcentricCirclesAnimation />
          </group>
        </group>
      ))}
    </group>
  );
};
