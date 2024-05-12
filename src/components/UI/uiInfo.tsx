import { convertChunkCoordinateToName } from "../../utils/functions";
import { useGameStore } from "../../store";
import { BeaconsInfo } from "../beacons/BeaconsInfo";
import TypingText from "../../effects/TextEffectsWrapper";
import AppearingGlitchEffect from "../../effects/AppearingUiEffectWrapper";
import { SystemControls } from "./controlsUI/planetControls";
import { ProgressBlock } from "./ProgressPanel";
import { BeaconManagementPanel, ResourceDistributionPanel, ResourceExtractionPanel, WarningPanel } from "./ResourceDistributionPanel";
import { TitlePanel } from "./TitlePanel";
import { BasicPanelWrapper } from "./BasicPanelWrapper";
import { SystemMessagePanel } from "./SystemMessagePanel";
import { ScanerParamPanel } from "./ScanerParamsPanel";
import { CollectedResourcesPanel } from "./CollectedResourcesPanel";
import { PlanetDataPanel } from "./PlanetDataPanel";
import { LogsPanel } from "./LogsPanel";

export const UiInfo = () => {
  const eventsLog = useGameStore((state) => state.eventsLog);
  const disableAnimations = useGameStore((state) => state.disableAnimations);
  const animationFirstStage = useGameStore((state) => state.animationFirstStage);

  if (!animationFirstStage) return null;
  // useEffect(() => {
  //   if (message === "") return;
  //   setTimeout(() => {
  //     useGameStore.setState({ message: "" });
  //   }, 2000);
  // }, [message]);

  return (
    <div>
      <SystemControls />
      <div className="fixed z-40">
        {/* <div onClick={(e) => e.stopPropagation()} className="w-full h-screen fixed border border-white bg-transparent select-none" /> */}
        <div className="fixed bottom-0 right-0 flex flex-row m-2">
          <SystemMessagePanel />
        </div>
        <div className="fixed top-0 left-0 m-2">
          <div className="flex flex-col">
            <div className="flex flex-row space-x-1">
              <AppearingGlitchEffect disabled={disableAnimations}>
                <TitlePanel /> 
              </AppearingGlitchEffect>
              <AppearingGlitchEffect disabled={disableAnimations}>
                <ProgressBlock />
              </AppearingGlitchEffect>
            </div>

            <div className="flex flex-row space-x-1">
              {/* <AppearingGlitchEffect disabled={disableAnimations}> */}
                <div className="flex flex-col space-y-1">
                  <CollectedResourcesPanel />
                  {/* <ResourceDistributionPanel /> */}
                  {/* <BasicPanelWrapper titleText="Energy:">{playerPoints}</BasicPanelWrapper> */}
                  <ScanerParamPanel />
                  {/* <BeaconManagementPanel /> */}
                  {/* <ResourceExtractionPanel /> */}
                  {/* <WarningPanel /> */}
                </div>
                <PlanetDataPanel />
              {/* </AppearingGlitchEffect> */}
            </div>
          </div>
        </div>
        <div className=" flex fixed bottom-0 left-0 flex-col m-2">
          <div className="flex flex-row space-x-1 items-end">
            <div className="flex flex-col space-y-1 items-end">
              <AppearingGlitchEffect disabled={disableAnimations}>
                <BasicPanelWrapper titleText="Events:">
                  {eventsLog.map((eventName, index) => (
                    <div key={index}>{eventName}</div>
                  ))}
                </BasicPanelWrapper>
                <LogsPanel />
              </AppearingGlitchEffect>
            </div>
            <BeaconsInfo />
          </div>
        </div>
        {/* <div className=" fixed bottom-0 left-1/2">{message}</div> */}
      </div>
    </div>
  );

};
