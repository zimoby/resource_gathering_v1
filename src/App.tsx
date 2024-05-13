import { useCalculateResources } from "./hooks/calculateResources";
import { UiInfo } from "./components/UI/uiInfo";
import { useInitInfo } from "./hooks/initInfo";
import { useGameLoop } from "./hooks/GameLoop";
import { GameCanvas } from "./Scene/GameCanvas";
import { useGameStore } from "./store";
import StartScreen from "./Scene/startScreen";

const App = () => {
  const startScreen = useGameStore((state) => state.startScreen);

  useInitInfo();
  useCalculateResources();
  // useParamsSync();
  useGameLoop();

  return (
    <>
      {startScreen ? (
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
