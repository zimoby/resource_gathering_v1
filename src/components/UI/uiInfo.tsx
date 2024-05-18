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
import { WarningBlock } from "./warningBlock";
import { FlickeringHtmlEffect } from "../../effects/AppearingUiEffectWrapper";


export const UiInfo = () => {
  const animationFirstStage = useGameStore((state) => state.animationFirstStage);
  // const showSettingsModal = useGameStore((state) => state.showSettingsModal);
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
        {/* <div
          className="fixed flex justify-center items-center z-50 bg-black/50 w-full h-full"
          style={{ display: showSettingsModal ? "flex" : "none" }}
        >
          <div className="bg-black/80 w-96 h-96 flex flex-col space-y-1 p-4 rounded-lg">
            <div className="w-full h-8 flex justify-end items-center">
              <button
                className="text-uitext text-lg cursor-pointer hover:bg-uilines hover:text-neutral-900"
                onClick={() => updateStoreProperty("showSettingsModal", false)}
              >
                X
              </button>
            </div>
            <div className="w-full h-8 flex justify-center items-center text-uitext text-lg">
              Settings
            </div>
            <div className="w-full h-8 flex justify-center items-center text-uitext text-lg">
              <label htmlFor="disableAnimations" className="text-uitext">
                Disable Animations
              </label>
              <input
                type="checkbox"
                id="disableAnimations"
                name="disableAnimations"
                checked={disableAnimations}
                onChange={() => useGameStore.getState().toggleDisableAnimations()}
              />
            </div>
          </div>
        </div> */}
        <WarningBlock />
        <div className="w-full h-16 flex-none flex flex-row gap-1">
          {/* <div className=" flex-none space-y-1"> */}
          <FlickeringHtmlEffect
            classStyles={"h-full flex flex-col flex-none space-y-1 "}
          >
            <TitlePanel />
            {/* <PlanetDataPanel />
            <CollectedResourcesPanel />
            <ScanerParamPanel />
            <BeaconsInfo />
            <div className=" w-48 h-full flex flex-col flex-grow border border-uilines"></div> */}
          </FlickeringHtmlEffect>
          {/* </div> */}
          {/* <div className=" flex-none "> */}
          <FlickeringHtmlEffect>
            <ProgressBlock />
          </FlickeringHtmlEffect>
          <FlickeringHtmlEffect>
            <SinePanel />
          </FlickeringHtmlEffect>

          {/* </div> */}
          {/* <SystemControls /> */}
          <FlickeringHtmlEffect classStyles="flex-none space-y-1">
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
            <div className="w-full h-48 flex flex-grow flex-row space-x-1 border border-uilines" />
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
          classStyles={"h-full flex flex-col space-y-1 "}
        >
          {/* <div space-y-1 > */}
          <PlanetDataPanel />
          <CollectedResourcesPanel />
          <ScanerParamPanel />
          <BeaconsInfo />
          {/* </div> */}
          {/* <div className=" flex flex-grow border border-uilines"></div> */}
          <div className=" h-44 mb-10 flex border border-uilines"></div>
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

  // return (
  //   <>
  //     {/* <SystemControls /> */}
  //     {/* <div
  //       className="fixed -z-10 border"
  //       style={{
  //         width: "calc(100vw - 10rem)",
  //         height: "calc(100vh - 10rem)",
  //         top: "5rem",
  //         left: "5rem"
  //       }}
  //       onClick={(e) => e.stopPropagation()}
  //     /> */}
  //     <div className="fixed z-40">
  //       {/* <div onClick={(e) => e.stopPropagation()} className="w-full h-screen fixed border border-white bg-transparent select-none" /> */}
  //       {/* <div className="fixed bottom-0 right-0 flex flex-row m-2">
  //         <SystemMessagePanel />
  //       </div> */}
  //       <div className="w-full fixed top-0 left-0 m-2">
  //         <div className="w-full flex flex-col">
  //           <div className="w-full flex flex-row space-x-1">
  //             {/* <FlickeringHtmlEffect> */}
  //               <TitlePanel />
  //             {/* </FlickeringHtmlEffect> */}
  //             {/* <FlickeringHtmlEffect> */}
  //               <ProgressBlock />
  //             {/* </FlickeringHtmlEffect> */}
  //             <div
  //               className="w-full h-full border"
  //               // style={{ width : "calc(100vw - 1rem)" }}
  //             />
  //           </div>

  //           <div className="flex flex-row space-x-1">
  //             {/* <FlickeringHtmlEffect> */}

  //               <div className="flex flex-col space-y-1">
  //                 <PlanetDataPanel />
  //                 <CollectedResourcesPanel />
  //                 {/* <ResourceDistributionPanel /> */}
  //                 {/* <BasicPanelWrapper titleText="Energy:">{playerPoints}</BasicPanelWrapper> */}
  //                 <ScanerParamPanel />
  //                 <BeaconsInfo />
  //                 {/* <BeaconManagementPanel /> */}
  //                 {/* <ResourceExtractionPanel /> */}
  //                 {/* <WarningPanel /> */}
  //               </div>

  //             {/* </FlickeringHtmlEffect> */}
  //           </div>
  //         </div>
  //       </div>
  //       <div className=" flex fixed bottom-0 left-0 flex-col m-2">
  //         <div className="flex flex-row space-x-1 items-end">
  //             <EventsPanel />
  //             <LogsPanel />
  //             <SystemMessagePanel />
  //           <div className="flex flex-col space-y-1 items-end">
  //             {/* <FlickeringHtmlEffect>
  //             </FlickeringHtmlEffect> */}
  //           </div>

  //         </div>
  //       </div>
  //     </div>
  //   </>
  // );
};
