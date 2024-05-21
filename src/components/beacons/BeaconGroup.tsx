import { useGameStore } from "../../store/store";
import { Cylinder, Sphere } from "@react-three/drei";
import { ConcentricCirclesAnimation } from "../gfx/concentricCircles";
import { useFrame } from "@react-three/fiber";
import { isOutOfBound, useCalculateDeltas } from "../../utils/functions";
import { createRef, useLayoutEffect, useMemo, useRef } from "react";
import { BufferGeometry, Group, Shape } from "three";
import { useIncreasingSpeed } from "../../effects/IncreaseSceneSpeed";

const beaconHeight = 10;
const minDistance = 20;

const ShapeCircle = () => {
  const shapePoints = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(0, 0);
    shape.absarc(0, 0, minDistance, 0, Math.PI * 2, false);
    const points = shape.getPoints(50);
    const circleBuffer = new BufferGeometry().setFromPoints(points);
    return circleBuffer;
  }, []);

  return (
    <lineSegments geometry={shapePoints} rotation-x={Math.PI / 2}>
      <lineBasicMaterial color={"#ff0000"} />
    </lineSegments>
  );
};

export const BeaconGroup = () => {
  const firstStart = useGameStore((state) => state.firstStart);
  const beacons = useGameStore((state) => state.beacons);
  const { width, depth, offsetX, offsetY } = useGameStore((state) => state.mapParams);
  const canPlaceBeacon = useGameStore((state) => state.canPlaceBeacon);
  const { deltaX, deltaY } = useCalculateDeltas();

  const beaconRefs = useRef<React.RefObject<Group>[]>(beacons.map(() => createRef()));
  const { speedRef: increasingSpeedRef } = useIncreasingSpeed(0, 1, 0.01, 2);

  const circleRefs = useRef<React.RefObject<Group>[]>(beacons.map(() => createRef()));

  useLayoutEffect(() => {
    beaconRefs.current = beaconRefs.current.slice(0, beacons.length);
    circleRefs.current = circleRefs.current.slice(0, beacons.length);
    for (let i = beaconRefs.current.length; i < beacons.length; i++) {
      beaconRefs.current[i] = createRef();
      circleRefs.current[i] = createRef();
    }
  }, [beacons.length]);

  useFrame((_, delta) => {
    beaconRefs.current.forEach((beacon, index) => {
      const beaconObject = beacon.current;
      const circleObject = circleRefs.current[index].current;
      if (beaconObject) {
        const checkBoundaries = isOutOfBound(
          { x: beaconObject.position.x, y: beaconObject.position.z },
          width,
          depth,
          offsetX,
          offsetY
        );

        beaconObject.position.x -= deltaX * increasingSpeedRef.current;
        beaconObject.position.z -= deltaY * increasingSpeedRef.current;
        beaconObject.visible = !checkBoundaries.x && !checkBoundaries.y;
      }

      if (circleObject) {
        circleObject.rotateY(delta / 2);
      }
    });
  });

  return (
    <group visible={firstStart}>
      {beacons.map((beacon, index) => (
        <group
          key={beacon.id}
          position={[beacon.x, beacon.y + 1, beacon.z]}
          ref={beaconRefs.current[index]}
        >
          <Sphere args={[1, 8, 8]} position={[0, beaconHeight, 0]} />
          <Cylinder args={[0.1, 0.1, beaconHeight, 4]} position={[0, beaconHeight / 2, 0]} />
          <group
            key={"circle_of_" + beacon.id}
            ref={circleRefs.current[index]}
            visible={canPlaceBeacon}
          >
            <ShapeCircle />
          </group>
          <ConcentricCirclesAnimation />
        </group>
      ))}
    </group>
  );
};
