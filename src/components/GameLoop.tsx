import { useEffect } from "react";
import useGamaStore from "../store";
import { useProcessBeacons } from "./beacons/beaconUtils";

export const useGameLoop = () => {
  // const
	const { destroyBeacons } = useProcessBeacons();

  useEffect(() => {
    const weatherInterval = setInterval(() => {
      useGamaStore.getState().updateWeather();
      //   console.log("Weather updated:", weatherCondition);
      destroyBeacons();
    }, 5000);

    return () => {
      clearInterval(weatherInterval);
    };
  }, [destroyBeacons]);
};
