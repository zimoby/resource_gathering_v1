import { useEffect } from "react";
import { useGameStore } from "../store/store";

export const useEnergyActions = () => {
  const playerPoints = useGameStore((state) => state.playerPoints);
  const { width, depth } = useGameStore((state) => state.mapParams);
  const updateMapSize = useGameStore((state) => state.updateMapSize);

  useEffect(() => {
    // console.log("useEnergyActions");
    if ((width > 100 || depth > 100) && playerPoints <= 0) {
      updateMapSize(100);
    }
  }, [width, depth, playerPoints, updateMapSize]);
};
