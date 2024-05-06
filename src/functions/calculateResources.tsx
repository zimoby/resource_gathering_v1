import { useEffect } from "react";
import useGamaStore, { resourceTypes } from "../store";

export const useCalculateResources = () => {
	const canPlaceBeacon = useGamaStore((state) => state.canPlaceBeacon);
	
  useEffect(() => {
    const interval = setInterval(() => {
      useGamaStore.setState((state) => {
        // Calculate the new player points
        let newPlayerPoints =
          state.playerPoints +
          state.beacons.reduce((total, beacon) => total + resourceTypes[beacon.resource].score, 0);

        // Calculate the new collected resources
        const newCollectedResources = { ...state.collectedResources };
        state.beacons.forEach((beacon) => {
          if (newCollectedResources.hasOwnProperty(beacon.resource)) {
            newCollectedResources[beacon.resource] += 1;
          } else {
            newCollectedResources[beacon.resource] = 1;
          }
        });

        if (canPlaceBeacon) {
          newPlayerPoints -= 50;
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
  }, [canPlaceBeacon]);
};
