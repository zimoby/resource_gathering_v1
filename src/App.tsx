import { useCalculateResources } from "./hooks/calculateResources";
import { UiInfo } from "./components/UI/uiInfo";
import { useInitInfo } from "./hooks/initInfo";
import { useGameLoop } from "./hooks/GameLoop";
import { GameCanvas } from "./Scene/GameCanvas";
import { useGameStore } from "./store/store";
import StartScreen from "./Scene/startScreen";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRunBgMusic, useSoundSystem } from "./hooks/soundSystem";
import { useMemo } from "react";

gsap.registerPlugin(useGSAP);

const App = () => {
  const startScreen = useGameStore((state) => state.startScreen);
  const firstStart = useGameStore((state) => state.firstStart);
  const setColors = useGameStore((state) => state.setColors);
  const colors = useGameStore((state) => state.colors);

  useMemo(() => {
    setColors(colors);
  }, [colors, setColors]);

  useInitInfo();
  useCalculateResources();
  // useParamsSync();
  useGameLoop();
  useSoundSystem();
  useRunBgMusic();

  return (
    <>
      {startScreen && !firstStart ? (
        <StartScreen />
      ) : (
        <>
          <UiInfo />
          <GameCanvas />
        </>
      )}
    </>
  );
};

export default App;
