import { convertChunkCoordinateToName } from "../../functions/functions";
import useGamaStore from "../../store";
import { BeaconsInfo } from "../beacons/BeaconsInfo";
import TypingText from "../../animations/TextEffects";

export const BasicPanelWrapper = ({ children, titleText }: { children: React.ReactNode, titleText: string }) => (
  <div className="h-fit w-52 text-left text-xs border border-white/80">
    <p className="w-full h-fit px-1 bg-neutral-200 text-neutral-900">{titleText}</p>
    <div className="scrollbar w-fll h-full p-1">{children}</div>
  </div>
);

export const UiInfo = () => {
  const selectedResource = useGamaStore((state) => state.selectedResource);
  const selectedChunk = useGamaStore((state) => state.selectedChunk);
  const mapParams = useGamaStore((state) => state.mapParams);
  const logs = useGamaStore((state) => state.logs);
  const eventsLog = useGamaStore((state) => state.eventsLog);

  const weatherCondition = useGamaStore((state) => state.weatherCondition);

  const message = useGamaStore((state) => state.message);

  const playerPoints = useGamaStore((state) => state.playerPoints);
  const collectedResources = useGamaStore((state) => state.collectedResources);

  // useEffect(() => {
  //   if (message === "") return;
  //   setTimeout(() => {
  //     useGamaStore.setState({ message: "" });
  //   }, 2000);
  // }, [message]);

  return (
    <div className="fixed z-40">
      <div className="fixed bottom-0 right-0 flex flex-row m-2">
        <div className="flex flex-row">
          <div className="size-20 border border-white flex justify-center items-center">
            <div className="size-16 border border-white" />
          </div>
          <div className="px-1 py-0.5 h-20 w-64 border border-white">
            <p className=" font-bold">Drone</p>
            <p className=" leading-3 text-sm">
              <TypingText text={message} />
            </p>
          </div>
        </div>
      </div>
      <div className="fixed top-0 left-0 m-1">
        <div className="flex flex-col">
          <div className="w-fit h-fit mb-1 border-8 border-neutral-200 p-1 text-xs bg-neutral-900 text-neutral-200">
            <div className="orbitron text-6xl text-neutral-200">{`PLANET-${mapParams.seed}`}</div>
          </div>
            
          <div className="flex flex-row space-x-1">
            <div className="flex flex-col space-y-1">
              <BasicPanelWrapper titleText="Collected Resources:">
                {Object.entries(collectedResources).map(([resource, count]) => (
                  <div key={resource}>
                    {resource}: {count}
                  </div>
                ))}
              </BasicPanelWrapper>
              <BasicPanelWrapper titleText="Energy:">
                {playerPoints}
              </BasicPanelWrapper>
              <BasicPanelWrapper titleText="Scaner:">
                <div>Selected Chunk: {convertChunkCoordinateToName(selectedChunk)}</div>
                <div>Selected Resource: {selectedResource}</div>
              </BasicPanelWrapper>
            </div>
            <BasicPanelWrapper titleText="Planet:">
              <p>Weather: {weatherCondition}</p>
            </BasicPanelWrapper>
          </div>
        </div>
      </div>
      <div className=" flex fixed bottom-0 left-0 flex-col">
        <div className="flex flex-row space-x-1 items-end">
          <div className="flex flex-col space-y-1 items-end">
            <BasicPanelWrapper titleText="Events:">
              {eventsLog.map((eventName, index) => (
                <div key={index}>{eventName}</div>
              ))}
            </BasicPanelWrapper>
            <BasicPanelWrapper titleText="LOGS:">
              {logs.map((log, index) => (
                <div key={index}>{log}</div>
              ))}
            </BasicPanelWrapper>
          </div>
          <BeaconsInfo />
        </div>
      </div>
      {/* <div className=" fixed bottom-0 left-1/2">{message}</div> */}
    </div>
  );
};
