import { useCallback } from "react";
import { useGameStore } from "../../store";
import { ArtefactT } from "../../store/gameStateSlice";

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
  // const currentChunk = useGameStore.getState().currentLocation;
  const artefacts = useGameStore((state) => state.artefacts);
  const { width, depth } = useGameStore((state) => state.mapParams);
  //   const weatherCondition = useGameStore((state) => state.weatherCondition);

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
      }
    },
    [addLog, artefacts]
  );

  const checkArtefactInRadius = useCallback(({ point }: { point: { x: number; y: number, z: number } }) => {
      const visibleArtefacts = artefacts.filter((artefact) => artefact.visible);

      const { currentOffset } = useGameStore.getState();
      const relativeChunkPosition = {
        x: currentOffset.x < 0 ? Math.round(point.x + currentOffset.x - width / 2) % width + width / 2 : Math.round((point.x + width / 2 + currentOffset.x) % width - width / 2),
        y: currentOffset.y < 0 ? Math.round(point.z + currentOffset.y - depth / 2) % depth + depth / 2 : Math.round((point.z + depth / 2 + currentOffset.y) % depth - depth / 2),
      };

      // consoleLog("relativeChunkPosition", relativeChunkPosition);

      const isWithinRadius = getArtefactInRadius(visibleArtefacts, relativeChunkPosition);

      if (isWithinRadius) {
        useGameStore.setState({ artefactSelected: isWithinRadius.id })
        // consoleLog("artefact in radius", {id: isWithinRadius.id})
        // useGameStore.setState({ message: "Cannot place beacon too close to another beacon." });
        // return;
      } else {
        useGameStore.setState({ artefactSelected: "" });
      }

      return isWithinRadius;
    }, [artefacts, depth, width]
  );

  //   const destroyBeacons = useCallback(() => {
  //     if (weatherCondition === "severe") {

  //       if (numBeaconsToDestroy > 0) {
  //         const destroyedBeacons: ArtefactT[] = [];

  //         for (let i = 0; i < numBeaconsToDestroy; i++) {
  //           const randomIndex = Math.floor(Math.random() * artefacts.length);
  //           const destroyedBeacon = artefacts[randomIndex];
  //           destroyedBeacons.push(destroyedBeacon);
  //           artefacts.splice(randomIndex, 1);
  //         }

  //         useGameStore.setState((state) => {
  //           const newBeacons = state.artefacts.filter(
  //             (beacon) => !destroyedBeacons.includes(beacon)
  //           );
  //           return { artefacts: newBeacons };
  //         });

  //         useGameStore.setState({
  //           message: `Destroyed ${numBeaconsToDestroy} artefacts due to severe weather.`,
  //         });
  //         addLog(`Destroyed ${numBeaconsToDestroy} artefacts due to severe weather.`);
  //       }
  //     }
  //   }, [addLog, artefacts, weatherCondition]);

  return { takeArtefact, checkArtefactInRadius };
};
