import { useCallback } from "react";
import { useGameStore } from "../../store/store";
import { ArtefactT } from "../../store/worldParamsSlice";

const getArtefactInRadius = (visibleArtefacts: ArtefactT[], position: { x: number; y: number }) => {
  return visibleArtefacts.find((beacon: { x: number; z: number }) => {
    const dx = position.x - beacon.x;
    const dz = position.y - beacon.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    return distance < 20;
  });
};

export const useProcessArtefacts = () => {
  const addLog = useGameStore((state) => state.addLog);
  const artefacts = useGameStore((state) => state.artefacts);
  const { width, depth } = useGameStore((state) => state.mapParams);
  const addArtefactToCollection = useGameStore((state) => state.addArtefactToCollection);

  const takeArtefact = useCallback(
    ({ artefactId }: { artefactId: string }) => {
      const artefact = artefacts.find((artefact) => artefact.id === artefactId);
      if (artefact) {
        useGameStore.setState((state) => {
          const newArtefacts = state.artefacts.filter((artefact) => artefact.id !== artefactId);
          return { artefacts: newArtefacts };
        });
        useGameStore.setState({ message: `Artefact taken` });
        addLog(`Artefact taken`);
        addArtefactToCollection(artefact.type);
      }
    },
    [addArtefactToCollection, addLog, artefacts]
  );

  const checkArtefactInRadius = useCallback(
    ({ point }: { point: { x: number; y: number; z: number } }) => {
      const visibleArtefacts = artefacts.filter((artefact) => artefact.visible);

      const { currentOffset } = useGameStore.getState();
      const relativeChunkPosition = {
        x:
          currentOffset.x < 0
            ? Math.round(((point.x + currentOffset.x - width / 2) % width) + width / 2)
            : Math.round(((point.x + width / 2 + currentOffset.x) % width) - width / 2),
        y:
          currentOffset.y < 0
            ? Math.round(((point.z + currentOffset.y - depth / 2) % depth) + depth / 2)
            : Math.round(((point.z + depth / 2 + currentOffset.y) % depth) - depth / 2),
      };

      const isWithinRadius = getArtefactInRadius(visibleArtefacts, relativeChunkPosition);

      if (isWithinRadius) {
        useGameStore.setState({ artefactSelected: isWithinRadius.id });
      } else {
        useGameStore.setState({ artefactSelected: "" });
      }

      return isWithinRadius;
    },
    [artefacts, depth, width]
  );

  return { takeArtefact, checkArtefactInRadius };
};
