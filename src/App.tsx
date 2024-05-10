import { useCalculateResources } from "./functions/calculateResources";
import { UiInfo } from "./components/UI/uiInfo";
import { useInitInfo } from "./components/initInfo";
import { useGameLoop } from "./components/GameLoop";
import { SystemControls } from "./components/UI/controlsUI/planetControls";
import { GameCanvas } from "./components/GameCanvas";

const App = () => {
  useInitInfo();
  useCalculateResources();
  // useParamsSync();
  useGameLoop();

  return (
    <>
      <UiInfo />
      <SystemControls />
      <GameCanvas />
    </>
  );
};

export default App;
