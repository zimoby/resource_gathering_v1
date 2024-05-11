import { useEffect } from "react";
import { useGameStore } from "../store";
import { useProcessBeacons } from "../components/beacons/beaconUtils";

export const useGameLoop = () => {
  // const
	const { destroyBeacons } = useProcessBeacons();
  const updateWeather = useGameStore.getState().updateWeather;
  const addEventLog = useGameStore.getState().addEventLog;
  // const eventsLog = useGameStore.getState().eventsLog;

  useEffect(() => {
    const weatherInterval = setInterval(() => {
      const receiveNewWether = updateWeather();

      if (!receiveNewWether) { return; }
      
      addEventLog(receiveNewWether);
      destroyBeacons();
    }, 5000);

    return () => {
      clearInterval(weatherInterval);
    };
  }, [addEventLog, destroyBeacons, updateWeather]);
};