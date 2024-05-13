import { useGameStore } from "../../store";
import { BeaconsInfo } from "../beacons/BeaconsInfo";
import AppearingGlitchEffect from "../../effects/AppearingUiEffectWrapper";
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

import './linearAnimation.css'
import { SinePanel } from "./SinePanel";
import { CorpLogoPanel } from "./CorpLogoPanel";

export const UiInfo = () => {
  const disableAnimations = useGameStore((state) => state.disableAnimations);
  const animationFirstStage = useGameStore((state) => state.animationFirstStage);

  if (!animationFirstStage) return null;

  return (
    <>
      <div
        className="fixed flex justify-between z-30 gap-1 bg-transparent"
        style={{
          width: "calc(100vw - 1rem)",
          height: "calc(100vh - 1rem)",
          left: "0.5rem",
          top: "0.5rem"
        }}
      >
        <div className="w-full h-16 flex-none flex flex-row gap-1">
          {/* <div className=" flex-none space-y-1"> */}
          <AppearingGlitchEffect disabled={disableAnimations} classStyles={"flex-none space-y-1"}>
            <TitlePanel />
            <PlanetDataPanel />
            <CollectedResourcesPanel />
            <ScanerParamPanel />
            <BeaconsInfo />
            <div className=" w-48 h-full flex flex-col flex-grow border"></div>
          </AppearingGlitchEffect>
          {/* </div> */}
          {/* <div className=" flex-none "> */}
          <AppearingGlitchEffect disabled={disableAnimations}>
            <ProgressBlock />
          </AppearingGlitchEffect>
          <AppearingGlitchEffect disabled={disableAnimations}>
            <SinePanel />
          </AppearingGlitchEffect>

          {/* </div> */}
          {/* <SystemControls /> */}
          <AppearingGlitchEffect disabled={disableAnimations} classStyles="flex-none space-y-1">
            <div className="w-48 h-24">
              <CorpLogoPanel />
            </div>
            <SystemControls />
            <div className="w-full h-48 flex flex-grow flex-row space-x-1 border" />
          </AppearingGlitchEffect>
        </div>

      </div>
      <div
        className="fixed flex justify-start items-end z-20 gap-1 bg-transparent"
        style={{
          width: "calc(100vw - 1rem)",
          height: "calc(100vh - 1rem)",
          left: "0.5rem",
          top: "0.5rem"
        }}
      >
        <AppearingGlitchEffect disabled={disableAnimations} classStyles="w-full flex flex-none space-x-1">
          <EventsPanel />
          <LogsPanel />
          <SystemMessagePanel />
          <div className="warning-sign2 w-full  flex flex-col space-y-1 items-end border "/>

        </AppearingGlitchEffect>
        {/* <div className="h-full w-16 flex-none flex flex-col gap-1"> */}
        {/* </div> */}
      </div>
    </>
  )

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
  //             {/* <AppearingGlitchEffect disabled={disableAnimations}> */}
  //               <TitlePanel />
  //             {/* </AppearingGlitchEffect> */}
  //             {/* <AppearingGlitchEffect disabled={disableAnimations}> */}
  //               <ProgressBlock />
  //             {/* </AppearingGlitchEffect> */}
  //             <div
  //               className="w-full h-full border"
  //               // style={{ width : "calc(100vw - 1rem)" }}
  //             />
  //           </div>

  //           <div className="flex flex-row space-x-1">
  //             {/* <AppearingGlitchEffect disabled={disableAnimations}> */}
              
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
                
  //             {/* </AppearingGlitchEffect> */}
  //           </div>
  //         </div>
  //       </div>
  //       <div className=" flex fixed bottom-0 left-0 flex-col m-2">
  //         <div className="flex flex-row space-x-1 items-end">
  //             <EventsPanel />
  //             <LogsPanel />
  //             <SystemMessagePanel />
  //           <div className="flex flex-col space-y-1 items-end">
  //             {/* <AppearingGlitchEffect disabled={disableAnimations}>
  //             </AppearingGlitchEffect> */}
  //           </div>
            
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // );

};
