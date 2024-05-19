import { useEffect } from "react";
import { useGameStore } from "../store";

export const useInitInfo = () => {
	const firstStart = useGameStore((state) => state.firstStart);
  const terrainLoading = useGameStore((state) => state.terrainLoading);
  const updateMapSize = useGameStore((state) => state.updateMapSize);
  const educationMode = useGameStore((state) => state.educationMode);
  const disableSounds = useGameStore((state) => state.disableSounds);
  const updateVariableInLocalStorage = useGameStore((state) => state.updateVariableInLocalStorage);
  // const setMapAnimationState = useGameStore((state) => state.setMapAnimationState);

  useEffect(() => {
    if (localStorage.getItem('educationMode') === null) {
      updateVariableInLocalStorage("educationMode", true);
    }

    if (localStorage.getItem('disableSounds') === null) {
      updateVariableInLocalStorage("disableSounds", false);
    }
    
    if (localStorage.getItem('invertDirection') === null) {
      updateVariableInLocalStorage("invertDirection", false);
    }

  }, [educationMode, disableSounds, updateVariableInLocalStorage]);

  useEffect(() => {
    // if (terrainLoading) {
    //   setMapAnimationState('enlarging');
    // }

    if (!terrainLoading && !firstStart) {
      useGameStore.setState({ firstStart: true });
    }
    if (!terrainLoading && firstStart) {
      updateMapSize(1);
    }
  }, [terrainLoading, firstStart, updateMapSize]);
};
