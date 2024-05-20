import { useGameStore } from "../../store";
import { BeaconsInfo } from "../beacons/BeaconsInfo";

import { SystemControls } from "./controlsUI/planetControls";
import { ProgressBlock } from "./ProgressPanel";
// import { BeaconManagementPanel, ResourceDistributionPanel, ResourceExtractionPanel, WarningPanel } from "./ResourceDistributionPanel";
import { TitlePanel } from "./TitlePanel";
// import { SystemMessagePanel } from "./SystemMessagePanel";
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
import { ArtefactsInfo } from "../artefacts/ArtefactsInfo";
import { SimpleWarningLines } from "./warningBlock";
import { EmptyGrowPanel } from "../gfx/EmptyPanel";


export const UiInfo = () => {
  const animationFirstStage = useGameStore((state) => state.animationFirstStage);
  const updateStoreProperty = useGameStore((state) => state.updateStoreProperty);

  if (!animationFirstStage) return null;

  return (
    <div
      className="fixed z-10"
      style={{
        width: "calc(100vw - 1rem)",
        height: "calc(100vh - 1rem)",
        left: "0.5rem",
        top: "0.5rem",
      }}
    >
      <SettingsModal />
      <div
        className="absolute top-0 left-0 h-16 flex justify-between gap-1 bg-transparent"
        style={{
          width: "calc(100vw - 13.23rem)",
        }}
      >
        <FlickeringHtmlEffect
          classStyles="flex flex-row space-x-1 w-full h-full"
        >
          <TitlePanel />
          <ProgressBlock />
          <SinePanel />
        </FlickeringHtmlEffect>
      </div>
      <div
        className="absolute right-0 top-0 flex justify-between gap-1 bg-transparent"
      >
        <FlickeringHtmlEffect
          classStyles={"h-full flex flex-col justify-between space-y-1 "}
          styles={{ height: "calc(100vh - 9.26rem)" }}
        >
          <div className="w-48 h-24">
            <CorpLogoPanel />
          </div>
          <BasicPanelWrapper styles="hover:bg-uilines" augUi={`border tl-clip br-clip --aug-border-bg`}>
            <button
              className=" orbitron w-full h-8 text-base text-uitext text-center cursor-pointer hover:text-neutral-900"
              onClick={() => updateStoreProperty("showSettingsModal", true)}
            >
              Settings
            </button>
          </BasicPanelWrapper>
          <BasicPanelWrapper styles="hover:bg-uilines"  augUi={`border tl-clip br-clip --aug-border-bg`}>
            <button
              className=" orbitron w-full h-8 text-base text-uitext text-center cursor-pointer hover:text-neutral-900"
              onClick={() => useGameStore.getState().setMapAnimationState('shrinking')}
            >
              New World
            </button>
          </BasicPanelWrapper>
          <SystemControls />
          <EmptyGrowPanel />
          <SimpleWarningLines size="h-16" />
          {/* <div className="warning-sign2 h-16 mb-10 flex border border-uilines" /> */}
        </FlickeringHtmlEffect>
      </div>
      <div
        className="absolute flex justify-start items-start gap-1 bg-transparent"
        style={{
          top: "4.25rem",
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
          </>
          <EmptyGrowPanel />
          <SimpleWarningLines size="h-16" />
          {/* <div className="warning-sign2 h-16 flex border border-uilines" /> */}
        </FlickeringHtmlEffect>
      </div>
      <div
        className="absolute bottom-0 w-full flex justify-start items-end gap-1 bg-transparent"
      >
        <FlickeringHtmlEffect
          classStyles="w-full flex flex-none space-x-1"
        >
          <EventsPanel />
          <LogsPanel />
          <BeaconsInfo />
          <ArtefactsInfo />
          <SimpleWarningLines />
        </FlickeringHtmlEffect>
      </div>
    </div>
  );
};
