import { convertChunkCoordinateToName } from "../../utils/functions";
import { useGameStore } from "../../store";
import { BeaconsInfo } from "../beacons/BeaconsInfo";
import TypingText from "../../effects/TextEffectsWrapper";
import AppearingGlitchEffect from "../../effects/AppearingUiEffectWrapper";
import { SystemControls } from "./controlsUI/planetControls";
import { ProgressBlock } from "./ProgressBlock";

export const BasicPanelWrapper = ({
  children,
  titleText,
  width = "w-52",
}: {
  children: React.ReactNode;
  titleText: string;
  width?: string;
}) => (
  <div className={`h-fit ${width} text-left text-xs border border-white/80`}>
    <p className="w-full h-fit px-1 bg-neutral-200 text-neutral-900">{titleText}</p>
    <div className="scrollbar w-full h-full p-1">{children}</div>
  </div>
);

export const UiInfo = () => {
  const selectedResource = useGameStore((state) => state.selectedResource);
  const selectedChunk = useGameStore((state) => state.selectedChunk);
  // const mapParams = useGameStore((state) => state.mapParams);
  const worldParams = useGameStore((state) => state.worldParams);
  const logs = useGameStore((state) => state.logs);
  const eventsLog = useGameStore((state) => state.eventsLog);
  const disableAnimations = useGameStore((state) => state.disableAnimations);

  const weatherCondition = useGameStore((state) => state.weatherCondition);

  const message = useGameStore((state) => state.message);

  const playerPoints = useGameStore((state) => state.playerPoints);
  const collectedResources = useGameStore((state) => state.collectedResources);

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
          <div className="flex flex-row">
            {/* <div className="size-20 border border-white flex justify-center items-center">
              <div className="size-16 border border-white" />
            </div> */}
            {/* <div className="px-1 py-0.5 h-20 w-64 border border-white"> */}
            <BasicPanelWrapper titleText="System Message">
              <div className=" leading-4 text-sm">
                <TypingText text={message} />
              </div>
            </BasicPanelWrapper>
            {/* <p className=" font-bold">System Message</p> */}
            {/* </div> */}
          </div>
        </div>
        <div className="fixed top-0 left-0 m-2">
          <div className="flex flex-col">
            <div className="flex flex-row space-x-1">
              <AppearingGlitchEffect disabled={disableAnimations}>
                {/* <div className="w-fit h-fit mb-1 border border-neutral-200 p-1 text-xs bg-neutral-900 text-neutral-200"> */}
                <div className="w-96 h-16 mb-1 border border-neutral-200 p-1 text-xs bg-neutral-900 text-neutral-200">
                  <div className="h-full w-full content-end orbitron text-2xl px-1 text-end uppercase text-neutral-200">
                    {`Planet-${worldParams.seed}`}
                  </div>
                </div>
              </AppearingGlitchEffect>
              <ProgressBlock />
            </div>

            <div className="flex flex-row space-x-1">
              {/* <AppearingGlitchEffect disabled={disableAnimations}> */}
                <div className="flex flex-col space-y-1">
                  <BasicPanelWrapper titleText="Collected Resources:">
                    {Object.entries(collectedResources).map(([resource, count]) => (
                      <div key={resource}>
                        {resource}: {count}
                      </div>
                    ))}
                  </BasicPanelWrapper>
                  <BasicPanelWrapper titleText="Energy:">{playerPoints}</BasicPanelWrapper>
                  <BasicPanelWrapper titleText="Scaner:">
                    <div>Selected Chunk: {convertChunkCoordinateToName(selectedChunk)}</div>
                    <div>Selected Resource: {selectedResource}</div>
                  </BasicPanelWrapper>
                </div>
                <BasicPanelWrapper titleText="Planet:">
                  {Object.entries(worldParams)
                    .filter(([key, value]) => value !== "" && key !== "weatherCondition")
                    .map(([key, value]) => (
                    <div key={key}>
                      {key}: {value}
                    </div>
                  ))}
                  <p>Weather: {weatherCondition}</p>
                </BasicPanelWrapper>
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
                <BasicPanelWrapper titleText="Logs:">
                  {logs.map((log, index) => (
                    <div key={index}>{log}</div>
                  ))}
                </BasicPanelWrapper>
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
