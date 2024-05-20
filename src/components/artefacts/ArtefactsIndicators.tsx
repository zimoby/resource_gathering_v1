import { Plane } from "@react-three/drei";
import { useGameStore } from "../../store";
import { DoubleSide, Euler, Vector3 } from "three";
import { useMemo } from "react";
import { FlickeringEffect } from "../../effects/FlickeringEffectWrapper";
import { ArtefactT } from "../../store/worldParamsSlice";
import { RingPlaneShader } from "../gfx/RingShader";

const maxDistance = 3;
const minOpacity = 0.02;
const maxOpacity = 0.9;
const dist = 11;

const calculateOpacity = (
  filterCondition: (artefact: ArtefactT) => boolean,
  currentCoord: number,
  chunkCoord: keyof ArtefactT,
  artefacts: ArtefactT[]
): number => {
  const existedArtefacts: ArtefactT[] = artefacts.filter(filterCondition);
  if (existedArtefacts.length === 0) return 0;

  let closestDistance = Infinity;
  for (const artefact of existedArtefacts) {
    const distance = Math.abs(Number(artefact[chunkCoord]) - currentCoord);
    if (distance === 0) return maxOpacity;
    closestDistance = Math.min(closestDistance, distance);
  }

  const opacity = Math.max(
    Math.min(
      maxOpacity,
      minOpacity + ((maxOpacity - minOpacity) * (maxDistance - closestDistance)) / maxDistance
    ),
    minOpacity
  );

  return opacity;
};

export const ArtefactsPlanesIndicators: React.FC = () => {
	const width = useGameStore((state) => state.mapParams.width);
	const depth = useGameStore((state) => state.mapParams.depth);
  const artefacts = useGameStore((state) => state.artefacts);
  const currentLocation = useGameStore((state) => state.currentLocation);

  const memoizedOpacities = useMemo(() => {
    return {
      artefactLeft: calculateOpacity(
        (artefact) => artefact.chunkX <= currentLocation.x,
        currentLocation.x,
        "chunkX",
        artefacts
      ),
      artefactTop: calculateOpacity(
        (artefact) => artefact.chunkY >= currentLocation.y,
        currentLocation.y,
        "chunkY",
        artefacts
      ),
      artefactRight: calculateOpacity(
        (artefact) => artefact.chunkX >= currentLocation.x,
        currentLocation.x,
        "chunkX",
        artefacts
      ),
      artefactBottom: calculateOpacity(
        (artefact) => artefact.chunkY <= currentLocation.y,
        currentLocation.y,
        "chunkY",
        artefacts
      ),
      artefactCenter: calculateOpacity(
        (artefact) =>
          artefact.chunkX === currentLocation.x && artefact.chunkY === currentLocation.y,
        currentLocation.x,
        "chunkX",
        artefacts
      ),
    };
  }, [artefacts, currentLocation]);
	
  const updatedPlanesConfig = useMemo(() => [
    {
      size: depth,
      position: new Vector3(-width / 2 - dist, 0, 0),
      rotation: new Euler(-Math.PI / 2, 0, Math.PI / 2),
      opacity: memoizedOpacities.artefactLeft,
    },
    {
      size: width,
      position: new Vector3(0, 0, -depth / 2 - dist),
      rotation: new Euler(-Math.PI / 2, 0, 0),
      opacity: memoizedOpacities.artefactBottom,
    },
    {
      size: depth,
      position: new Vector3(width / 2 + dist, 0, 0),
      rotation: new Euler(-Math.PI / 2, 0, -Math.PI / 2),
      opacity: memoizedOpacities.artefactRight,
    },
    {
      size: width,
      position: new Vector3(0, 0, depth / 2 + dist),
      rotation: new Euler(-Math.PI / 2, 0, Math.PI),
      opacity: memoizedOpacities.artefactTop,
    },
  ], [depth, width, memoizedOpacities.artefactLeft, memoizedOpacities.artefactBottom, memoizedOpacities.artefactRight, memoizedOpacities.artefactTop]);


  return (
    <group position={[0, -0.3, 0]}>
      <RingPlaneShader
        color={"#00ff00"}
        position={new Vector3(0, 1, 0)}
        rotation={new Euler(-Math.PI / 2, 0, 0)}
        opacity={memoizedOpacities.artefactCenter}
      />
      <FlickeringEffect appearingOnly={true}>
        {updatedPlanesConfig.map((config, index) => (
          <Plane key={index} args={[config.size, 3]} position={config.position} rotation={config.rotation}>
            <meshBasicMaterial
              side={DoubleSide}
              color={"#ffffff"}
              transparent
              opacity={config.opacity}
            />
          </Plane>
        ))}
      </FlickeringEffect>
    </group>
  );
};