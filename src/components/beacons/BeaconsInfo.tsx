import { useGameStore } from "../../store/store";
import { convertChunkCoordinateToName } from "../../utils/functions";
import { BasicPanelWrapper } from "../UI/BasicPanelWrapper";

export const BeaconsInfo = () => {
  const beacons = useGameStore((state) => state.beacons);
  const opacity = useGameStore((state) => state.uiPanelsState.beaconPanel.opacity);
  const beaconsLimit = useGameStore((state) => state.beaconsLimit);
  const increaseBeconsLimit = useGameStore((state) => state.increaseBeconsLimit);

  return (
    <BasicPanelWrapper
      height="h-32"
      width="w-fit"
      titleText={`Beacons: ${beacons.length} / ${beaconsLimit}`}
      opacity={opacity}
    >
      <>
        {beacons.length === 0 && "No beacons"}
        {beacons.length === beaconsLimit && (
          <button
            className=" px-2 mb-1 flex justify-center items-center bg-uilines text-neutral-900 text-center h-5 hover:bg-orange-500 cursor-pointer"
            onClick={increaseBeconsLimit}
          >
            + Extend beacons limit +
          </button>
        )}
        {beacons.slice(0, 100).map((beacon, index) => (
          <div
            key={index}
            className="list-selecting pr-3"
            onClick={() => useGameStore.setState({ message: `Beacon: ${beacon.resource}` })}
          >
            {index +
              1 +
              "." +
              convertChunkCoordinateToName({ x: beacon.chunkX, y: beacon.chunkY }) +
              ": " +
              beacon.resource}
          </div>
        ))}
        <div className="h-5" />
      </>
    </BasicPanelWrapper>
  );
};
