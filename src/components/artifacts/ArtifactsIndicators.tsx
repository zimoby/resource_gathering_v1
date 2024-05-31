import { Plane } from "@react-three/drei";
import { useGameStore } from "../../store/store";
import { DoubleSide, Euler, Vector3 } from "three";
import React, { useMemo } from "react";
import { FlickeringEffect } from "../../effects/FlickeringEffectWrapper";
import { ArtifactT } from "../../store/worldParamsSlice";
import { RingPlaneShader } from "../gfx/RingShader";

const maxDistance = 3;
const minOpacity = 0.02;
const maxOpacity = 0.9;
const dist = 11;

const calculateOpacity = (
  filterCondition: (artifact: ArtifactT) => boolean,
  currentCoord: number,
  chunkCoord: keyof ArtifactT,
  artifacts: ArtifactT[],
): number => {
  const existedArtifacts: ArtifactT[] = artifacts.filter(filterCondition);
  if (existedArtifacts.length === 0) return 0;

  let closestDistance = Infinity;
  for (const artifact of existedArtifacts) {
    const distance = Math.abs(Number(artifact[chunkCoord]) - currentCoord);
    if (distance === 0) return maxOpacity;
    closestDistance = Math.min(closestDistance, distance);
  }

  const opacity = Math.max(
    Math.min(
      maxOpacity,
      minOpacity +
        ((maxOpacity - minOpacity) * (maxDistance - closestDistance)) /
          maxDistance,
    ),
    minOpacity,
  );

  return opacity;
};

interface ArtifactsPlaneIndicatorProps {
  config: {
    size: number;
    position: Vector3;
    rotation: Euler;
    opacity: number;
  };
}

export const ArtifactsPlanesIndicators: React.FC = () => {
  const width = useGameStore((state) => state.mapParams.width);
  const depth = useGameStore((state) => state.mapParams.depth);
  const artifacts = useGameStore((state) => state.artifacts);
  const currentLocation = useGameStore((state) => state.currentLocation);

  const memoizedOpacities = useMemo(() => {
    return {
      artifactLeft: calculateOpacity(
        (artifact) => artifact.chunkX <= currentLocation.x,
        currentLocation.x,
        "chunkX",
        artifacts,
      ),
      artifactTop: calculateOpacity(
        (artifact) => artifact.chunkY >= currentLocation.y,
        currentLocation.y,
        "chunkY",
        artifacts,
      ),
      artifactRight: calculateOpacity(
        (artifact) => artifact.chunkX >= currentLocation.x,
        currentLocation.x,
        "chunkX",
        artifacts,
      ),
      artifactBottom: calculateOpacity(
        (artifact) => artifact.chunkY <= currentLocation.y,
        currentLocation.y,
        "chunkY",
        artifacts,
      ),
      artifactCenter: calculateOpacity(
        (artifact) =>
          artifact.chunkX === currentLocation.x &&
          artifact.chunkY === currentLocation.y,
        currentLocation.x,
        "chunkX",
        artifacts,
      ),
    };
  }, [artifacts, currentLocation]);

  const updatedPlanesConfig = useMemo(
    () => [
      {
        size: depth,
        position: new Vector3(-width / 2 - dist, 0, 0),
        rotation: new Euler(-Math.PI / 2, 0, Math.PI / 2),
        opacity: memoizedOpacities.artifactLeft,
      },
      {
        size: width,
        position: new Vector3(0, 0, -depth / 2 - dist),
        rotation: new Euler(-Math.PI / 2, 0, 0),
        opacity: memoizedOpacities.artifactBottom,
      },
      {
        size: depth,
        position: new Vector3(width / 2 + dist, 0, 0),
        rotation: new Euler(-Math.PI / 2, 0, -Math.PI / 2),
        opacity: memoizedOpacities.artifactRight,
      },
      {
        size: width,
        position: new Vector3(0, 0, depth / 2 + dist),
        rotation: new Euler(-Math.PI / 2, 0, Math.PI),
        opacity: memoizedOpacities.artifactTop,
      },
    ],
    [depth, width, memoizedOpacities],
  );

  return (
    <group position={[0, -0.3, 0]}>
      <RingPlaneShader
        color={"#00ff00"}
        position={new Vector3(0, 1, 0)}
        rotation={new Euler(-Math.PI / 2, 0, 0)}
        opacity={memoizedOpacities.artifactCenter}
      />
      <FlickeringEffect appearingOnly={true}>
        {updatedPlanesConfig.map((config, index) => (
          <ArtifactsPlaneIndicator key={index} config={config} />
        ))}
      </FlickeringEffect>
    </group>
  );
};

const ArtifactsPlaneIndicator: React.FC<ArtifactsPlaneIndicatorProps> =
  React.memo(({ config }) => (
    <Plane
      args={[config.size, 3]}
      position={config.position}
      rotation={config.rotation}
    >
      <meshBasicMaterial
        side={DoubleSide}
        color={"#ffffff"}
        transparent
        opacity={config.opacity}
      />
    </Plane>
  ));

ArtifactsPlaneIndicator.displayName = "ArtifactsPlaneIndicator";
