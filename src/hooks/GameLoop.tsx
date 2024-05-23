import { useEffect, useRef } from "react";
import { useGameStore } from "../store/store";
import { useProcessBeacons } from "../components/beacons/beaconUtils";

export const useGameLoop = () => {
	const { destroyBeacons } = useProcessBeacons();
  const updateWeather = useGameStore.getState().updateWeather;
  const addEventLog = useGameStore.getState().addEventLog;
  const weatherRef = useRef<number | null>(null);

  useEffect(() => {
    weatherRef.current = setInterval(() => {
      const receiveNewWether = updateWeather();

      if (!receiveNewWether) { return; }
      
      addEventLog(receiveNewWether);
      destroyBeacons();
    }, 5000);

    return () => {
      if (weatherRef.current !== null) {
        clearInterval(weatherRef.current);
      }
    };
  }, [addEventLog, destroyBeacons, updateWeather]);
};
