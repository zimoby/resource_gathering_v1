import { useCalculateResources } from "./hooks/calculateResources";
import { UiInfo } from "./components/UI/uiInfo";
import { useInitInfo } from "./hooks/initInfo";
import { useGameLoop } from "./hooks/GameLoop";
import { GameCanvas } from "./Scene/GameCanvas";

const App = () => {
  useInitInfo();
  useCalculateResources();
  // useParamsSync();
  useGameLoop();

  return (
    <>
      <UiInfo />
      <GameCanvas />
    </>
  );
};

export default App;
