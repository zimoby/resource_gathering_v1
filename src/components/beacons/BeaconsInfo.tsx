import { useGameStore } from "../../store";
import { convertChunkCoordinateToName } from "../../utils/functions";
import { BasicPanelWrapper } from "../UI/BasicPanelWrapper";

export const BeaconsInfo = () => {
  const beacons = useGameStore((state) => state.beacons);
  const opacity = useGameStore((state) => state.uiPanelsState.beaconPanel.opacity);

  return (
    <BasicPanelWrapper
      height="h-32"
      width="w-fit"
      titleText={`Beacons: ${beacons.length}`}
      opacity={opacity}
    >
      <>
        {/* <div className="h-fit max-h-40"> */}
        {beacons.length === 0 && "No beacons"}
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
      </>
    </BasicPanelWrapper>
  );
};
