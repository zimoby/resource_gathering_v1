import { useGameStore } from "../../store";
import { BeaconsInfo } from "../beacons/BeaconsInfo";
import AppearingGlitchEffect from "../../effects/AppearingUiEffectWrapper";
import { SystemControls } from "./controlsUI/planetControls";
import { ProgressBlock } from "./ProgressPanel";
import { BeaconManagementPanel, ResourceDistributionPanel, ResourceExtractionPanel, WarningPanel } from "./ResourceDistributionPanel";
import { TitlePanel } from "./TitlePanel";
import { SystemMessagePanel } from "./SystemMessagePanel";
import { ScanerParamPanel } from "./ScanerParamsPanel";
import { CollectedResourcesPanel } from "./CollectedResourcesPanel";
import { PlanetDataPanel } from "./PlanetDataPanel";
import { LogsPanel } from "./LogsPanel";
import { EventsPanel } from "./EventsPanel";

export const UiInfo = () => {
  const disableAnimations = useGameStore((state) => state.disableAnimations);
  const animationFirstStage = useGameStore((state) => state.animationFirstStage);

  if (!animationFirstStage) return null;


  return (
    <div>
      <SystemControls />
      {/* <div
        className="fixed -z-10 border"
        style={{
          width: "calc(100vw - 10rem)",
          height: "calc(100vh - 10rem)",
          top: "5rem",
          left: "5rem"
        }}
        onClick={(e) => e.stopPropagation()}
      /> */}
      <div className="fixed z-40">
        {/* <div onClick={(e) => e.stopPropagation()} className="w-full h-screen fixed border border-white bg-transparent select-none" /> */}
        {/* <div className="fixed bottom-0 right-0 flex flex-row m-2">
          <SystemMessagePanel />
        </div> */}
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
                  <PlanetDataPanel />
                  <CollectedResourcesPanel />
                  {/* <ResourceDistributionPanel /> */}
                  {/* <BasicPanelWrapper titleText="Energy:">{playerPoints}</BasicPanelWrapper> */}
                  <ScanerParamPanel />
                  <BeaconsInfo />
                  {/* <BeaconManagementPanel /> */}
                  {/* <ResourceExtractionPanel /> */}
                  {/* <WarningPanel /> */}
                </div>
                
              {/* </AppearingGlitchEffect> */}
            </div>
          </div>
        </div>
        <div className=" flex fixed bottom-0 left-0 flex-col m-2">
          <div className="flex flex-row space-x-1 items-end">
              <EventsPanel />
              <LogsPanel />
              <SystemMessagePanel />
            <div className="flex flex-col space-y-1 items-end">
              {/* <AppearingGlitchEffect disabled={disableAnimations}>
              </AppearingGlitchEffect> */}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );

};
