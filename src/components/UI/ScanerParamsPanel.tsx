import { useMemo } from "react";
import { useGameStore } from "../../store";
import { BasicPanelWrapper } from "./BasicPanelWrapper";
import { convertChunkCoordinateToName } from "../../utils/functions";

export const ScanerParamPanel = () => {
  const opacity = useGameStore((state) => state.uiPanelsState.scanerPanel.opacity);
  const selectedChunk = useGameStore((state) => state.selectedChunk);
  const selectedResource = useGameStore((state) => state.selectedResource);

  const chunkName = useMemo(() => {
    return convertChunkCoordinateToName(selectedChunk);
  }, [selectedChunk]);

  return (
    <BasicPanelWrapper titleText="Scaner:" opacity={opacity}>
      <div>Selected Chunk: </div>
      <div>{chunkName}</div>
      <div>Selected Resource:</div>
      <div>{selectedResource}</div>
  </BasicPanelWrapper>
  )
};
