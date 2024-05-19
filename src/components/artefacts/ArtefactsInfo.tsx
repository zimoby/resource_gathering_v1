import { useMemo } from "react";
import { useGameStore } from "../../store";
import { convertChunkCoordinateToName } from "../../utils/functions";
import { BasicPanelWrapper } from "../UI/BasicPanelWrapper";
import { artefactAmount } from "../../store/gameStateSlice";

export const ArtefactsInfo = () => {
  const artefacts = useGameStore((state) => state.artefacts);
  const opacity = useGameStore((state) => state.uiPanelsState.beaconPanel.opacity);

  const memoizedBeacons = useMemo(() => {

    return (
      <BasicPanelWrapper titleText="Artefacts:" opacity={opacity}>
        <div className="h:fit max-h-44">
          <p>Amount: {artefacts.length} / {artefactAmount}</p>
          {artefacts.length === 0 && "No artefacts"}
          {artefacts.slice(0, 100).map((artefact, index) => (
            <div key={index}>
              {convertChunkCoordinateToName({ x: artefact.chunkX, y: artefact.chunkY }) +
                ": " +
                artefact.chunkX + ":" + artefact.chunkY +
                ": " + Math.round(artefact.x) + ":" + Math.round(artefact.z)  
              }
            </div>
          ))}
        </div>
      </BasicPanelWrapper>
    );
  }, [artefacts, opacity]);

  return memoizedBeacons;
};
