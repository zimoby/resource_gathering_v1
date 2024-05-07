import { convertChunkCoordinateToName } from "../functions/functions";
import useGamaStore from "../store";

export const UiInfo = () => {
  const selectedResource = useGamaStore((state) => state.selectedResource);
  const selectedChunk = useGamaStore((state) => state.selectedChunk);

  const message = useGamaStore((state) => state.message);

  const playerPoints = useGamaStore((state) => state.playerPoints);
  const collectedResources = useGamaStore((state) => state.collectedResources);

  return (
    <>
      <div className="orbitron z-50 fixed top-0 left-0 text-6xl">PLANET-01</div>
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
