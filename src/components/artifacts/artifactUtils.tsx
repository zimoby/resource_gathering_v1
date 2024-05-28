import { useCallback } from "react";
import { useGameStore } from "../../store/store";
import { ArtifactT } from "../../store/worldParamsSlice";

const getArtifactInRadius = (
  visibleArtifacts: ArtifactT[],
  position: { x: number; y: number },
) => {
  return visibleArtifacts.find((beacon: { x: number; z: number }) => {
    const dx = position.x - beacon.x;
    const dz = position.y - beacon.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    return distance < 20;
  });
};

export const useProcessArtifacts = () => {
  const addLog = useGameStore((state) => state.addLog);
  const artifacts = useGameStore((state) => state.artifacts);
  const { width, depth } = useGameStore((state) => state.mapParams);
  const addArtifactToCollection = useGameStore(
    (state) => state.addArtifactToCollection,
  );
  const addToArtifactsArray = useGameStore(
    (state) => state.addToArtifactsArray,
  );

  const takeArtifact = useCallback(
    ({ artifactId }: { artifactId: string }) => {
      const artifact = artifacts.find((artifact) => artifact.id === artifactId);
      if (artifact) {
        useGameStore.setState((state) => {
          const newArtifacts = state.artifacts.filter(
            (artifact) => artifact.id !== artifactId,
          );
          return { artifacts: newArtifacts };
        });
        useGameStore.setState({ message: `Artifact taken` });
        addLog(`Artifact taken`);
        addArtifactToCollection(artifact.type);
        addToArtifactsArray(artifact);
      }
    },
    [addArtifactToCollection, addLog, addToArtifactsArray, artifacts],
  );

  const checkArtifactInRadius = useCallback(
    ({ point }: { point: { x: number; y: number; z: number } }) => {
      const visibleArtifacts = artifacts.filter((artifact) => artifact.visible);

      const { currentOffset } = useGameStore.getState();
      const relativeChunkPosition = {
        x:
          currentOffset.x < 0
            ? Math.round(
                ((point.x + currentOffset.x - width / 2) % width) + width / 2,
              )
            : Math.round(
                ((point.x + width / 2 + currentOffset.x) % width) - width / 2,
              ),
        y:
          currentOffset.y < 0
            ? Math.round(
                ((point.z + currentOffset.y - depth / 2) % depth) + depth / 2,
              )
            : Math.round(
                ((point.z + depth / 2 + currentOffset.y) % depth) - depth / 2,
              ),
      };

      const isWithinRadius = getArtifactInRadius(
        visibleArtifacts,
        relativeChunkPosition,
      );

      if (isWithinRadius) {
        useGameStore.setState({ artifactSelected: isWithinRadius.id });
      } else {
        useGameStore.setState({ artifactSelected: "" });
      }

      return isWithinRadius;
    },
    [artifacts, depth, width],
  );

  return { takeArtifact, checkArtifactInRadius };
};
