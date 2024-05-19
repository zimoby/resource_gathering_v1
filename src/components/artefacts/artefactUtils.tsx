import { useCallback } from "react";
import { useGameStore } from "../../store";
import { ResourceType } from "../../store/worldParamsSlice";
import { ArtefactT, BeaconType } from "../../store/gameStateSlice";

const minDistance = 20;

export const useProcessArtefacts = () => {
  const addLog = useGameStore((state) => state.addLog);
  // const currentChunk = useGameStore.getState().currentLocation;
  const artefacts = useGameStore((state) => state.artefacts);
  //   const weatherCondition = useGameStore((state) => state.weatherCondition);

  const takeArtefact = useCallback(
    ({ artefactId }: { artefactId: string }) => {
      const artefact = artefacts.find((artefact) => artefact.id === artefactId);
      if (artefact) {
        useGameStore.setState((state) => {
          const newArtefacts = state.artefacts.filter((artefact) => artefact.id !== artefactId);
          return { artefacts: newArtefacts };
        });
        useGameStore.setState({ message: `Artefact taken.` });
        addLog(`Artefact taken.`);
      }
    },
    [artefacts]
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

  return { takeArtefact };
};
