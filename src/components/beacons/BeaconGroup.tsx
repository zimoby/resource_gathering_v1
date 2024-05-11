import { useGameStore } from "../../store";
import { Circle, Cylinder, Sphere } from "@react-three/drei";
import { ConcentricCirclesAnimation } from "../gfx/concentricCircles";
import { useFrame } from "@react-three/fiber";
import { isOutOfBound, useCalculateDeltas } from "../../utils/functions";
import { createRef, useLayoutEffect, useRef } from "react";
import { Group } from "three";

export const BeaconGroup = () => {
  const firstStart = useGameStore((state) => state.firstStart);
  const beacons = useGameStore((state) => state.beacons);
  const { width, depth, offsetX, offsetY } = useGameStore((state) => state.mapParams);
  const canPlaceBeacon = useGameStore((state) => state.canPlaceBeacon);
  const { deltaX, deltaY } = useCalculateDeltas();

  const beaconRefs = useRef<React.RefObject<Group>[]>(beacons.map(() => createRef()));

  const beaconHeight = 10;
  const minDistance = 20;

  // console.log("beacons:", beacons);

  useLayoutEffect(() => {
    beaconRefs.current = beaconRefs.current.slice(0, beacons.length);
    for (let i = beaconRefs.current.length; i < beacons.length; i++) {
        beaconRefs.current[i] = createRef();
    }
    // console.log("beaconRefs:", beaconRefs.current);
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
          <group position={[beacon.x, beacon.y + 1, beacon.z]} ref={beaconRefs.current[index]}>
            <Sphere args={[1, 8, 8]} position={[0, beaconHeight, 0]} />
            <Cylinder args={[0.1, 0.1, beaconHeight, 4]} position={[0, beaconHeight / 2, 0]} />
            <Cylinder visible={canPlaceBeacon} args={[minDistance, minDistance, 0.2, 16]} position={[0, 0, 0]}>
              <meshBasicMaterial wireframe color={"#8D1919"} />
            </Cylinder>
            {/* <Circle args={[1, 8]} position={[0, 1, 0]} rotation-x={Math.PI / 2}>
              <meshBasicMaterial color={"#ff0000"} />
            </Circle> */}
            <ConcentricCirclesAnimation />
          </group>
        </group>
      ))}
    </group>
  );
};
