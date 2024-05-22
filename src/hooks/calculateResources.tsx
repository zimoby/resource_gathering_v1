import { useEffect, useRef } from "react";
import { useGameStore } from "../store/store";

export const useCalculateResources = () => {
  const intervalRef = useRef<number | null>(null);
  const updateResourcesAndPoints = useGameStore((state) => state.updateResourcesAndPoints);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      updateResourcesAndPoints();
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

};
