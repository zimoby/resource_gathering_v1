import { useCalculateResources } from "./hooks/calculateResources";
import { UiInfo } from "./components/UI/uiInfo";
import { useInitInfo } from "./hooks/initInfo";
import { useGameLoop } from "./hooks/GameLoop";
import { GameCanvas } from "./Scene/GameCanvas";
import { useGameStore } from "./store/store";
import StartScreen from "./Scene/startScreen";

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);


const App = () => {
  const startScreen = useGameStore((state) => state.startScreen);
  const firstStart = useGameStore((state) => state.firstStart);

  useInitInfo();
  useCalculateResources();
  // useParamsSync();
  useGameLoop();

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
