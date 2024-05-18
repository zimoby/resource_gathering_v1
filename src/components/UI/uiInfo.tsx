import { useGameStore } from "../../store";
import { BeaconsInfo } from "../beacons/BeaconsInfo";

import { SystemControls } from "./controlsUI/planetControls";
import { ProgressBlock } from "./ProgressPanel";
// import { BeaconManagementPanel, ResourceDistributionPanel, ResourceExtractionPanel, WarningPanel } from "./ResourceDistributionPanel";
import { TitlePanel } from "./TitlePanel";
import { SystemMessagePanel } from "./SystemMessagePanel";
import { ScanerParamPanel } from "./ScanerParamsPanel";
import { CollectedResourcesPanel } from "./CollectedResourcesPanel";
import { PlanetDataPanel } from "./PlanetDataPanel";
import { LogsPanel } from "./LogsPanel";
import { EventsPanel } from "./EventsPanel";

import "./linearAnimation.css";
import { SinePanel } from "./SinePanel";
import { CorpLogoPanel } from "./CorpLogoPanel";
import { BasicPanelWrapper } from "./BasicPanelWrapper";
import { FlickeringHtmlEffect } from "../../effects/AppearingUiEffectWrapper";
import { SettingsModal } from "./SettingsModal";


export const UiInfo = () => {
  const animationFirstStage = useGameStore((state) => state.animationFirstStage);
  const updateStoreProperty = useGameStore((state) => state.updateStoreProperty);

  if (!animationFirstStage) return null;

  return (
    <>
      <div
        className="fixed flex justify-between z-30 gap-1 bg-transparent"
        style={{
          width: "calc(100vw - 1rem)",
          height: "calc(100vh - 1rem)",
          left: "0.5rem",
          top: "0.5rem",
        }}
      >
        {/* modal settings window */}
        <SettingsModal />
        {/* <WarningBlock /> */}
        <div className="w-full h-16 flex-none flex flex-row gap-1">
          {/* <div className=" flex-none space-y-1"> */}
          <FlickeringHtmlEffect
            classStyles="flex flex-row space-x-1 w-full h-full"
          >
            <TitlePanel />
            <ProgressBlock />
            <SinePanel />
          </FlickeringHtmlEffect>

          <FlickeringHtmlEffect
            classStyles={"h-full flex flex-col justify-between space-y-1 "}
            styles={{ height: "calc(100vh - 9.26rem)" }}
          >
            <div className="w-48 h-24">
              <CorpLogoPanel />
            </div>
            <BasicPanelWrapper>
              <button
                className="w-full text-lg text-uitext text-center cursor-pointer hover:bg-uilines hover:text-neutral-900"
                onClick={() => updateStoreProperty("showSettingsModal", true)}
              >
                Settings
              </button>
            </BasicPanelWrapper>
            <SystemControls />
            <div className=" flex flex-grow border border-uilines"></div>
            <div className="warning-sign2 h-16 mb-10 flex border border-uilines" />
          </FlickeringHtmlEffect>
        </div>
      </div>
      <div
        className="fixed flex justify-start items-start mt-16 z-20 gap-1 bg-transparent"
        style={{
          width: "calc(100vw - 1rem)",
          height: "calc(100vh - 1rem)",
          left: "0.5rem",
          top: "0.77rem",
        }}
      >
        <FlickeringHtmlEffect
          classStyles={"h-full flex flex-col justify-between space-y-1 "}
          styles={{ height: "calc(100vh - 13.51rem)" }}
        >
            <>
              <PlanetDataPanel />
              <CollectedResourcesPanel />
              <ScanerParamPanel />
              <BeaconsInfo />

            </>
            {/* </div> */}
            <div className=" flex flex-grow border border-uilines"></div>
            <div className="warning-sign2 h-16 mb-10 flex border border-uilines" />
            {/* <div className="warning-sign2 w-full flex flex-col space-y-1 items-end border border-uilines" /> */}
        </FlickeringHtmlEffect>
      </div>
      <div
        className="fixed flex justify-start items-end z-20 gap-1 bg-transparent"
        style={{
          width: "calc(100vw - 1rem)",
          height: "calc(100vh - 1rem)",
          left: "0.5rem",
          top: "0.5rem",
        }}
      >
        <FlickeringHtmlEffect
          classStyles="w-full flex flex-none space-x-1"
        >
          <EventsPanel />
          <LogsPanel />
          <SystemMessagePanel />
          <div className="warning-sign2 w-full flex flex-col space-y-1 items-end border border-uilines" />
        </FlickeringHtmlEffect>
        {/* <div className="h-full w-16 flex-none flex flex-col gap-1"> */}
        {/* </div> */}
      </div>
    </>
  );
};
