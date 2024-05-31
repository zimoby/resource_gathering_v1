import { useGameStore } from "../../store/store";
import { Octahedron, Tetrahedron } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { isOutOfBound, useCalculateDeltas } from "../../utils/functions";
import { createRef, useMemo, useRef } from "react";
import { Color, Group, TorusKnotGeometry } from "three";
import { useIncreasingSpeed } from "../../effects/IncreaseSceneSpeed";

const beaconHeight = 10;

const artifactColors = {
  default: new Color("white"),
  selected: new Color("yellow"),
};

const Artifact = ({ type, selected }: { type: string; selected: boolean }) => {
  const Component = useMemo(() => {
    switch (type) {
      case "usual":
        return UsualArtifact;
      case "rare":
        return RareArtifact;
      case "legendary":
        return LegendaryArtifact;
      default:
        return UsualArtifact;
    }
  }, [type]);

  const color = selected ? artifactColors.selected : artifactColors.default;

  return <Component color={color} />;
};

const UsualArtifact = ({ color }: { color: Color }) => {
  return (
    <Octahedron args={[4, 0]} position={[0, beaconHeight, 0]} scale={[1, 2, 1]}>
      <meshStandardMaterial color={color} />
    </Octahedron>
  );
};

const RareArtifact = ({ color }: { color: Color }) => {
  return (
    <Tetrahedron
      args={[4, 0]}
      position={[0, beaconHeight, 0]}
      scale={[1, 2, 1]}
    >
      <meshStandardMaterial color={color} />
    </Tetrahedron>
  );
};

const LegendaryArtifact = ({ color }: { color: Color }) => {
  const geometry = useMemo(() => {
    return new TorusKnotGeometry(3, 1, 64, 16);
  }, []);

  return (
    <mesh geometry={geometry} position={[0, beaconHeight, 0]}>
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export const ArtifactsGroup = () => {
  const firstStart = useGameStore((state) => state.firstStart);
  const artifacts = useGameStore((state) => state.artifacts);
  const artifactSelected = useGameStore((state) => state.artifactSelected);
  const canSetBeacon = useGameStore((state) => state.canPlaceBeacon);
  const { width, depth, offsetX, offsetY } = useGameStore(
    (state) => state.mapParams,
  );
  const { deltaX, deltaY } = useCalculateDeltas();
  const timeRef = useRef(0);

  const artifactRefs = useRef<React.RefObject<Group>[]>(
    artifacts.map(() => createRef()),
  );
  const { speedRef: increasingSpeedRef } = useIncreasingSpeed(0, 1, 0.01, 2);

  const circleRefs = useRef<React.RefObject<Group>[]>(
    artifacts.map(() => createRef()),
  );

  useFrame((_, delta) => {
    artifactRefs.current.forEach((beacon, index) => {
      const artifactObject = beacon.current;
      const circleObject = circleRefs.current[index].current;

      if (artifactObject) {
        artifactObject.position.x -=
          deltaX * (delta * 100) * increasingSpeedRef.current;
        artifactObject.position.z -=
          deltaY * (delta * 100) * increasingSpeedRef.current;

        const checkBoundaries = isOutOfBound(
          { x: artifactObject.position.x, y: artifactObject.position.z },
          width,
          depth,
          offsetX,
          offsetY,
        );

        if (artifactSelected === artifacts[index].id && canSetBeacon) {
          timeRef.current += delta;
          artifactObject.position.y = Math.sin(timeRef.current * 2) * 3 - 10;

          if (circleObject) {
            circleObject.position.y = -Math.sin(timeRef.current * 2) * 3 - 10;
          }
        }

        artifactObject.rotateY(delta / 2);
        artifactObject.visible = !checkBoundaries.x && !checkBoundaries.y;

        if (artifactObject.visible !== artifacts[index].visible) {
          useGameStore.setState((state) => {
            state.artifacts[index].visible = artifactObject.visible;
            return state;
          });
        }
      }
    });
  });

  return (
    <group visible={firstStart}>
      {artifacts.map((artifact, index) => (
        <group
          key={artifact.id}
          position={[
            artifact.x + artifact.chunkX * 100,
            artifact.y + 1,
            artifact.z + artifact.chunkY * 100,
          ]}
          ref={artifactRefs.current[index]}
        >
          <Artifact
            type={artifact.type}
            selected={artifactSelected === artifact.id}
          />
        </group>
      ))}
    </group>
  );
};
