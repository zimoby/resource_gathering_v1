import { useGameStore } from "../../store";
import { Octahedron, Tetrahedron } from "@react-three/drei";
import { ConcentricCirclesAnimation } from "../gfx/concentricCircles";
import { useFrame } from "@react-three/fiber";
import { isOutOfBound, useCalculateDeltas } from "../../utils/functions";
import { createRef, useMemo, useRef } from "react";
import { Group, TorusKnotGeometry } from "three";
import { useIncreasingSpeed } from "../../effects/IncreaseSceneSpeed";

const beaconHeight = 10;

const UsualArtefact = () => {
  return (
    <Octahedron args={[4, 0]} position={[0, beaconHeight, 0]} scale={[1,2,1]}>
      <meshStandardMaterial  color={"#ffffff"} />
    </Octahedron>
  );
}

const RareArtefact = () => {
  return (
    <Tetrahedron args={[4, 0]} position={[0, beaconHeight, 0]} scale={[1,2,1]}>
      <meshStandardMaterial  color={"#00ff00"} />
    </Tetrahedron>
  );
}

const LegendaryArtefact = () => {

  const geometry = useMemo(() => {
    return new TorusKnotGeometry(3, 1, 64, 16);
  }, []);

  return (
    <mesh geometry={geometry} position={[0, beaconHeight, 0]}>
      <meshStandardMaterial color={"#ffffff"} />
    </mesh>
  );
}

export const ArtefactsGroup = () => {
  const firstStart = useGameStore((state) => state.firstStart);
  const artefacts = useGameStore((state) => state.artefacts);
  const artefactSelected = useGameStore((state) => state.artefactSelected);
  const canSetBeacon = useGameStore((state) => state.canPlaceBeacon);
  const { width, depth, offsetX, offsetY } = useGameStore((state) => state.mapParams);
  const { deltaX, deltaY } = useCalculateDeltas();
  const timeRef = useRef(0);

  const artefactRefs = useRef<React.RefObject<Group>[]>(artefacts.map(() => createRef()));
  const { speedRef: increasingSpeedRef } = useIncreasingSpeed(0, 1, 0.01, 2);

  const circleRefs = useRef<React.RefObject<Group>[]>(artefacts.map(() => createRef()));

  useFrame((_, delta) => {
    artefactRefs.current.forEach((beacon, index) => {
      const artefactObject = beacon.current;
      const circleObject = circleRefs.current[index].current;

      if (artefactObject) {
        artefactObject.position.x -= deltaX * increasingSpeedRef.current;
        artefactObject.position.z -= deltaY * increasingSpeedRef.current;
        
        const checkBoundaries = isOutOfBound(
          { x: artefactObject.position.x, y: artefactObject.position.z },
          width,
          depth,
          offsetX,
          offsetY
        );

        if (artefactSelected === artefacts[index].id && canSetBeacon) {
          timeRef.current += delta;
          artefactObject.position.y = Math.sin(timeRef.current * 2) * 3;

          if (circleObject) {
            circleObject.position.y = -Math.sin(timeRef.current * 2) * 3;
          }
        }

				artefactObject.rotateY(delta / 2);
        artefactObject.visible = !checkBoundaries.x && !checkBoundaries.y;

				if (artefactObject.visible !== artefacts[index].visible) {
					useGameStore.setState((state) => {
						state.artefacts[index].visible = artefactObject.visible;
						return state;
					});
				}
      }
    });
  });

  return (
    <group visible={firstStart}>
      {artefacts.map((artefact, index) => (
        <group
          key={artefact.id}
          position={[artefact.x + artefact.chunkX * 100, artefact.y + 1, artefact.z + artefact.chunkY * 100]}
          ref={artefactRefs.current[index]}
        >
          {artefact.type === "usual" && <UsualArtefact />}
          {artefact.type === "rare" && <RareArtefact />}
          {artefact.type === "legendary" && <LegendaryArtefact />}
          <group ref={circleRefs.current[index]}>
            <ConcentricCirclesAnimation />
          </group>
        </group>
      ))}
    </group>
  );
};
