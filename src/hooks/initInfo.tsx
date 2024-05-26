import { useEffect } from "react";
import {
  SETTING_DISABLE_MUSIC,
  SETTING_DISABLE_SOUNDS,
  SETTING_EDUCATION_MODE,
  SETTING_INVERT_DIRECTION,
  SETTING_START_SCREEN,
  useGameStore,
} from "../store/store";

export const useInitInfo = () => {
  const firstStart = useGameStore((state) => state.firstStart);
  const terrainLoading = useGameStore((state) => state.terrainLoading);
  const updateMapSize = useGameStore((state) => state.updateMapSize);
  const educationMode = useGameStore((state) => state.educationMode);
  const disableSounds = useGameStore((state) => state.disableSounds);
  const updateVariableInLocalStorage = useGameStore(
    (state) => state.updateVariableInLocalStorage,
  );

  useEffect(() => {
    if (localStorage.getItem(SETTING_EDUCATION_MODE) === null) {
      updateVariableInLocalStorage(SETTING_EDUCATION_MODE, true);
    }

    if (localStorage.getItem(SETTING_DISABLE_SOUNDS) === null) {
      updateVariableInLocalStorage(SETTING_DISABLE_SOUNDS, false);
    }

    if (localStorage.getItem(SETTING_DISABLE_MUSIC) === null) {
      updateVariableInLocalStorage(SETTING_DISABLE_MUSIC, false);
    }

    if (localStorage.getItem(SETTING_INVERT_DIRECTION) === null) {
      updateVariableInLocalStorage(SETTING_INVERT_DIRECTION, false);
    }

    if (localStorage.getItem(SETTING_START_SCREEN) === null) {
      updateVariableInLocalStorage(SETTING_START_SCREEN, true);
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
