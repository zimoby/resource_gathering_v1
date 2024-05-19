import { useMemo } from "react";
import { useGameStore } from "../../store";
import { convertChunkCoordinateToName } from "../../utils/functions";
import { BasicPanelWrapper } from "../UI/BasicPanelWrapper";

export const ArtefactsInfo = () => {
  const artefacts = useGameStore((state) => state.artefacts);
  const opacity = useGameStore((state) => state.uiPanelsState.beaconPanel.opacity);

  const memoizedBeacons = useMemo(() => {

    return (
      <BasicPanelWrapper titleText="artefacts:" opacity={opacity}>
        <div className="h:fit max-h-44">
          {artefacts.length === 0 && "No artefacts"}
          {artefacts.slice(0, 100).map((artefact, index) => (
            <div key={index}>
              {convertChunkCoordinateToName({ x: artefact.chunkX, y: artefact.chunkY }) +
                ": " +
                artefact.chunkX + ":" + artefact.chunkY}
            </div>
          ))}
        </div>
      </BasicPanelWrapper>
    );
  }, [artefacts, opacity]);

  return memoizedBeacons;
};
