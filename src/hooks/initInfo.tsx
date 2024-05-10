import { useEffect } from "react";
import { useGameStore } from "../store";

export const useInitInfo = () => {
	const firstStart = useGameStore((state) => state.firstStart);
  const loading = useGameStore((state) => state.loading);
  const updateMapSize = useGameStore((state) => state.updateMapSize);

  useEffect(() => {
    if (!loading && !firstStart) {
      useGameStore.setState({ firstStart: true });
    }
    if (!loading && firstStart) {
      updateMapSize(100);
    }
  }, [loading, firstStart, updateMapSize]);

};
