import { useEffect } from "react";
import { useGameStore } from "../store";
import { resourceTypes } from "../store/worldParamsSlice";

export const useCalculateResources = () => {
	const canPlaceBeacon = useGameStore((state) => state.canPlaceBeacon);
  const addEventLog = useGameStore((state) => state.addEventLog);
	
  useEffect(() => {
    const interval = setInterval(() => {
      useGameStore.setState((state) => {

        // Calculate the new player points
        let newPlayerPoints =
          state.playerPoints +
          state.beacons.reduce((total, beacon) => total + resourceTypes[beacon.resource].score, 0);

        // Calculate the new collected resources
        const newCollectedResources = { ...state.collectedResources };
        state.beacons.forEach((beacon) => {
          if (Object.prototype.hasOwnProperty.call(newCollectedResources, beacon.resource)) {
            newCollectedResources[beacon.resource] += 1;
          } else {
            newCollectedResources[beacon.resource] = 1;
          }
        });

        if (canPlaceBeacon && state.playerPoints >= 50) {
          newPlayerPoints -= 50;
          addEventLog("Scanning. -50 points");
        }

        return {
          playerPoints: newPlayerPoints,
          collectedResources: newCollectedResources,
        };
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [addEventLog, canPlaceBeacon]);
};
