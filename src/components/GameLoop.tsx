import { useEffect } from "react";
import useGamaStore from "../store";
import { useProcessBeacons } from "./beacons/beaconUtils";

export const useGameLoop = () => {
  // const
	const { destroyBeacons } = useProcessBeacons();
  const updateWeather = useGamaStore.getState().updateWeather;
  const addEventLog = useGamaStore.getState().addEventLog;
  // const eventsLog = useGamaStore.getState().eventsLog;

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
