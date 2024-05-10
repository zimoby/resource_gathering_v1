import { useEffect } from "react";
import { convertChunkCoordinateToName } from "../functions/functions";
import useGamaStore from "../store";

export const UiInfo = () => {
  const selectedResource = useGamaStore((state) => state.selectedResource);
  const selectedChunk = useGamaStore((state) => state.selectedChunk);
  const mapParams = useGamaStore((state) => state.mapParams);
  const logs = useGamaStore((state) => state.logs);
  // const weatherCondition = useGamaStore((state) => state.weatherCondition);

  const message = useGamaStore((state) => state.message);

  const playerPoints = useGamaStore((state) => state.playerPoints);
  const collectedResources = useGamaStore((state) => state.collectedResources);

  useEffect(() => {
    if (message === "") return;
    setTimeout(() => {
      useGamaStore.setState({ message: "" });
    }, 2000);
  }, [message]);
  
  return (
    <>
      <div className="fixed z-50 top-0 left-0">
        <div className="flex flex-col">
          <div className="orbitron z-50 text-6xl">{`PLANET-${mapParams.seed}`}</div>
          <div className="scrollbar z-50 p-1 h-fit max-h-56 w-52 text-left m-2 text-xs rounded-sm border border-white/80">
            LOGS:
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="z-50 flex fixed bottom-0 left-0 flex-col">
        <div>Selected Chunk: {convertChunkCoordinateToName(selectedChunk)}</div>
        <div>Selected Resource: {selectedResource}</div>
        <div className=" text-lg ">Player Points: {playerPoints}</div>
        {Object.entries(collectedResources).map(([resource, count]) => (
          <div key={resource}>
            {resource}: {count}
          </div>
        ))}
      </div>
      <div className="z-50 fixed bottom-0 left-1/2">{message}</div>
    </>
  );
};
