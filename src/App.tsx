import { useCalculateResources } from "./functions/calculateResources";
import { BeaconsInfo } from "./components/beacons/BeaconsInfo";
import { UiInfo } from "./components/uiInfo";
import { useInitInfo } from "./components/initInfo";
import { useGameLoop } from "./components/GameLoop";
import { SystemControls } from "./components/controlsUI/planetControls";
import { GameCanvas } from "./components/GameCanvas";

const App = () => {
  useInitInfo();
  useCalculateResources();
  // useParamsSync();
  useGameLoop();

  return (
    <>
      {/* <WarningBlock /> */}
      <UiInfo />
      <BeaconsInfo />
      <SystemControls />
      <GameCanvas />
    </>
  );
};

export default App;
