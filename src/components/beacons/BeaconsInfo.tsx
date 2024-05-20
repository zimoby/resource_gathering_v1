import { useMemo } from "react";
import { useGameStore } from "../../store";
import { convertChunkCoordinateToName } from "../../utils/functions";
import { BasicPanelWrapper } from "../UI/BasicPanelWrapper";

export const BeaconsInfo = () => {
  const beacons = useGameStore((state) => state.beacons);
  const opacity = useGameStore((state) => state.uiPanelsState.beaconPanel.opacity);

  const memoizedBeacons = useMemo(() => {

    return (
      <BasicPanelWrapper titleText="Beacons:" opacity={opacity}>
        <div className="h-fit max-h-40">
          {beacons.length === 0 && "No beacons"}
          {beacons.slice(0, 100).map((beacon, index) => (
            <div key={index}>
              {(index + 1) + "." + convertChunkCoordinateToName({ x: beacon.chunkX, y: beacon.chunkY }) +
                ": " +
                beacon.resource}
            </div>
          ))}
        </div>
      </BasicPanelWrapper>
    );
  }, [beacons, opacity]);

  return memoizedBeacons;
};
