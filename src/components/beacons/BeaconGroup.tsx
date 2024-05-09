import useGamaStore from "../../store";
import { Cylinder, Sphere } from "@react-three/drei";
import { ConcentricCirclesAnimation } from "../concentricCircles";
import { useFrame } from "@react-three/fiber";
import { isOutOfBound } from "../../functions/functions";
import { createRef, useLayoutEffect, useRef } from "react";

export const BeaconGroup = () => {
  const firstStart = useGamaStore((state) => state.firstStart);
  const beacons = useGamaStore((state) => state.beacons);
  const direction = useGamaStore((state) => state.moveDirection);
  const dynamicSpeed = useGamaStore((state) => state.dynamicSpeed);

  const { width, depth, offsetX, offsetY, speed } = useGamaStore((state) => state.mapParams);

  const beaconRefs = useRef(beacons.map(() => createRef()));

  const deltaX = direction.x * (speed * dynamicSpeed);
  const deltaY = direction.y * (speed * dynamicSpeed);

  const beaconHeight = 10;

  useLayoutEffect(() => {
    beaconRefs.current = beaconRefs.current.slice(0, beacons.length);
    for (let i = beaconRefs.current.length; i < beacons.length; i++) {
        beaconRefs.current[i] = createRef();
    }
    console.log("beaconRefs:", beaconRefs.current);
}, [beacons.length]);

  useFrame(() => {

    beaconRefs.current.forEach((beacon, index) => {
      const beaconObject = beacon.current;
      if (beaconObject) {

        beaconObject.position.x -= deltaX;
        beaconObject.position.z -= deltaY;

        const visibilityBoundaries = !isOutOfBound({x: beaconObject.position.x, y: beaconObject.position.z}, width, depth, offsetX, offsetY);
        beaconObject.visible = visibilityBoundaries;
      }
    });
  });

  return (
    <group visible={firstStart}>
      {beacons.map((beacon, index) => (
        <group key={index}>
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
