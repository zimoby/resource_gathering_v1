import { useCalculateResources } from "./utils/calculateResources";
import { UiInfo } from "./components/UI/uiInfo";
import { useInitInfo } from "./hooks/initInfo";
import { useGameLoop } from "./hooks/GameLoop";
import { SystemControls } from "./components/UI/controlsUI/planetControls";
import { GameCanvas } from "./Scene/GameCanvas";

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
