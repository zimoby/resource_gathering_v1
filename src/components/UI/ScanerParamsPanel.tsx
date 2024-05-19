import { useMemo } from "react";
import { useGameStore } from "../../store";
import { BasicPanelWrapper } from "./BasicPanelWrapper";
import { convertChunkCoordinateToName } from "../../utils/functions";

export const ScanerParamPanel = () => {
  const opacity = useGameStore((state) => state.uiPanelsState.scanerPanel.opacity);
  const selectedChunk = useGameStore((state) => state.selectedChunk);
  const selectedResource = useGameStore((state) => state.selectedResource);
  const currentLocation = useGameStore((state) => state.currentLocation);
  const currentOffset = useGameStore((state) => state.currentOffset);
  const activePosition = useGameStore((state) => state.activePosition);

  const chunkName = useMemo(() => {
    return convertChunkCoordinateToName(selectedChunk);
  }, [selectedChunk]);

  return (
    <BasicPanelWrapper titleText="Scaner:" opacity={opacity}>
      <div>Selected Chunk:</div>
      <div>{chunkName}</div>
      <div>Selected Resource:</div>
      <div>{selectedResource}</div>
      <div>Current Location:</div>
      <div>{Math.round(currentLocation.x) + ":" + Math.round(currentLocation.y)}</div>
      <div>Current Offset:</div>
      <div>{Math.round(currentOffset.x) + ":" + Math.round(currentOffset.y)}</div>
      <div>Active Position:</div>
      <div>{Math.round(activePosition.x) + ":" + Math.round(activePosition.y)}</div>
  </BasicPanelWrapper>
  )
};
