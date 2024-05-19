import { useGameStore } from "../../store";
import { Octahedron } from "@react-three/drei";
import { ConcentricCirclesAnimation } from "../gfx/concentricCircles";
import { useFrame } from "@react-three/fiber";
import { isOutOfBound, useCalculateDeltas } from "../../utils/functions";
import { createRef, useRef } from "react";
import { Group } from "three";
import { useIncreasingSpeed } from "../../effects/IncreaseSceneSpeed";

const beaconHeight = 10;
// const minDistance = 10;

// const ShapeCircle = () => {
//   const shapePoints = useMemo(() => {
//     const shape = new Shape();
//     shape.moveTo(0, 0);
//     shape.absarc(0, 0, minDistance, 0, Math.PI * 2, false);
//     const points = shape.getPoints(50);
//     const circleBuffer = new BufferGeometry().setFromPoints(points);
//     return circleBuffer;
//   }, []);

//   return (
//     <lineSegments geometry={shapePoints} rotation-x={Math.PI / 2}>
//       <lineBasicMaterial color={"#ff0000"} />
//     </lineSegments>
//   );
// };

export const ArtefactsGroup = () => {
  const firstStart = useGameStore((state) => state.firstStart);
  const artefacts = useGameStore((state) => state.artefacts);
  const artefactSelected = useGameStore((state) => state.artefactSelected);
  const canSetBeacon = useGameStore((state) => state.canPlaceBeacon);
  const { width, depth, offsetX, offsetY } = useGameStore((state) => state.mapParams);
  const { deltaX, deltaY } = useCalculateDeltas();
  const timeRef = useRef(0);

  const beaconRefs = useRef<React.RefObject<Group>[]>(artefacts.map(() => createRef()));
  const { speedRef: increasingSpeedRef } = useIncreasingSpeed(0, 1, 0.01, 2);

  const circleRefs = useRef<React.RefObject<Group>[]>(artefacts.map(() => createRef()));

  // console.log("artefacts:", { artefacts, beaconRefs });

  //   useLayoutEffect(() => {
  //     beaconRefs.current = beaconRefs.current.slice(0, artefacts.length);
  //     circleRefs.current = circleRefs.current.slice(0, artefacts.length);
  //     for (let i = beaconRefs.current.length; i < artefacts.length; i++) {
  //         beaconRefs.current[i] = createRef();
  //         circleRefs.current[i] = createRef();
  //     }
  //   }, [artefacts.length]);

  useFrame((state_, delta) => {
    const time = state_.clock.getElapsedTime();
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

        if (artefactSelected === artefacts[index].id && canSetBeacon) {
          timeRef.current += delta;
          // sin anim
          beaconObject.position.y = Math.sin(timeRef.current * 2) * 3;

          if (circleObject) {
            circleObject.position.y = -Math.sin(timeRef.current * 2) * 3;
            // circleObject.rotateY(delta / 2);
          }
        }

				beaconObject.rotateY(delta / 2);
        beaconObject.visible = !checkBoundaries.x && !checkBoundaries.y;

				// if visibility changes, update the beacon object in the store
				if (beaconObject.visible !== artefacts[index].visible) {
					// console.log("visibility changed", artefacts[index]);
					useGameStore.setState((state) => {
						state.artefacts[index].visible = beaconObject.visible;
						return state;
					});
				}
      }


    });
  });

  return (
    <group visible={firstStart}>
      {artefacts.map((beacon, index) => (
        <group
          key={beacon.id}
          position={[beacon.x + beacon.chunkX * 100, beacon.y + 1, beacon.z + beacon.chunkY * 100]}
          ref={beaconRefs.current[index]}
        >
          <Octahedron args={[4, 0]} position={[0, beaconHeight, 0]} scale={[1,2,1]}>
						<meshStandardMaterial  color={"#ffffff"} />
					</Octahedron>
          {/* <Sphere args={[1, 8, 8]} position={[0, beaconHeight, 0]} />
          <Cylinder args={[0.1, 0.1, beaconHeight, 4]} position={[0, beaconHeight / 2, 0]} /> */}
          {/* <group key={"circle_of_" + beacon.id} ref={circleRefs.current[index]}>
            <ShapeCircle />
          </group> */}
          <group ref={circleRefs.current[index]}>
            <ConcentricCirclesAnimation />
          </group>
        </group>
      ))}
    </group>
  );
};
