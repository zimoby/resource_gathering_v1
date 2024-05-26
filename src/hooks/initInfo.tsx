import { useEffect } from "react";
import { SETTING_DISABLE_SOUNDS, SETTING_EDUCATION_MODE, SETTING_INVERT_DIRECTION, useGameStore } from "../store/store";

export const useInitInfo = () => {
	const firstStart = useGameStore((state) => state.firstStart);
  const terrainLoading = useGameStore((state) => state.terrainLoading);
  const updateMapSize = useGameStore((state) => state.updateMapSize);
  const educationMode = useGameStore((state) => state.educationMode);
  const disableSounds = useGameStore((state) => state.disableSounds);
  const updateVariableInLocalStorage = useGameStore((state) => state.updateVariableInLocalStorage);

  useEffect(() => {
    if (localStorage.getItem('educationMode') === null) {
      updateVariableInLocalStorage(SETTING_EDUCATION_MODE, true);
    }

    if (localStorage.getItem('disableSounds') === null) {
      updateVariableInLocalStorage(SETTING_DISABLE_SOUNDS, false);
    }
    
    if (localStorage.getItem('invertDirection') === null) {
      updateVariableInLocalStorage(SETTING_INVERT_DIRECTION, false);
    }

    if (localStorage.getItem('startScreen') === null) {
      updateVariableInLocalStorage('startScreen', true);
    }

  }, [educationMode, disableSounds, updateVariableInLocalStorage]);

  useEffect(() => {
    if (!terrainLoading && !firstStart) {
      useGameStore.setState({ firstStart: true });
    }
    if (!terrainLoading && firstStart) {
      updateMapSize(1);
    }
  }, [terrainLoading, firstStart, updateMapSize]);
};
