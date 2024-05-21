import { useEffect } from "react";
import { useGameStore } from "../store/store";
import { resourceTypes } from "../store/worldParamsSlice";

export const useCalculateResources = () => {
	const canPlaceBeacon = useGameStore((state) => state.canPlaceBeacon);
  const addEventLog = useGameStore((state) => state.addEventLog);
  const costs = useGameStore((state) => state.costs);
	
  useEffect(() => {
    const interval = setInterval(() => {
      useGameStore.setState((state) => {

        const newCollectedResources = { ...state.collectedResources };
        state.beacons.forEach((beacon) => {
          if (Object.prototype.hasOwnProperty.call(newCollectedResources, beacon.resource)) {
            newCollectedResources[beacon.resource] += 1;
          } else {
            newCollectedResources[beacon.resource] = 1;
          }
        });

        return {
          collectedResources: newCollectedResources,
        };
      });
    }, 1000);

    const intervalUpdate = setInterval(() => {
      useGameStore.setState((state) => {

        let newPlayerPoints =
          state.playerPoints +
          state.beacons.reduce((total, beacon) => total + resourceTypes[beacon.resource].score, 0);

        if (canPlaceBeacon && state.playerPoints >= costs.scanning.value) {
          newPlayerPoints -= costs.scanning.value;
          addEventLog(`Scanning. -${costs.scanning.value} energy`);
        } else if ( state.playerPoints < costs.scanning.value && canPlaceBeacon) {
          useGameStore.setState({ message: `Not enough energy to scan. Need ${costs.scanning.value} energy`})
        }

        return {
          playerPoints: newPlayerPoints,
        };
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(intervalUpdate);
    };
  }, [addEventLog, canPlaceBeacon, costs.scanning.value]);
};
