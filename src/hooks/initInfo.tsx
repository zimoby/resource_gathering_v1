import { useEffect } from "react";
import { useGameStore } from "../store";

export const useInitInfo = () => {
	const firstStart = useGameStore((state) => state.firstStart);
  const terrainLoading = useGameStore((state) => state.terrainLoading);
  const updateMapSize = useGameStore((state) => state.updateMapSize);
  const educationMode = useGameStore((state) => state.educationMode);
  const updateVariableInLocalStorage = useGameStore((state) => state.updateVariableInLocalStorage);

  useEffect(() => {
    if (localStorage.getItem('educationMode') === null) {
      updateVariableInLocalStorage("educationMode", true);
    }
  }, [educationMode, updateVariableInLocalStorage]);

  useEffect(() => {
    if (!terrainLoading && !firstStart) {
      useGameStore.setState({ firstStart: true });
    }
    if (!terrainLoading && firstStart) {
      updateMapSize(1);
    }
  }, [terrainLoading, firstStart, updateMapSize]);
};
