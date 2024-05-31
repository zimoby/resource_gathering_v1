import { useMemo } from "react";
import { useGameStore } from "../../../store/store";
import { BasicPanelWrapper } from "../BasicPanelWrapper";
import { convertChunkCoordinateToName } from "../../../utils/functions";

export const ScanerParamPanel = () => {
  const opacity = useGameStore(
    (state) => state.uiPanelsState.scanerPanel.opacity,
  );
  const selectedChunk = useGameStore((state) => state.selectedChunk);
  const selectedResource = useGameStore((state) => state.selectedResource);
  const currentLocation = useGameStore((state) => state.currentLocation);

  const chunkName = useMemo(() => {
    return convertChunkCoordinateToName(selectedChunk);
  }, [selectedChunk]);

  const memoData = useMemo(() => {
    return [
      {
        title: "Selected Chunk:",
        value: chunkName,
      },
      {
        title: "Selected Resource:",
        value: selectedResource,
      },
      {
        title: "Current Location:",
        value:
          Math.round(currentLocation.x) + ":" + Math.round(currentLocation.y),
      },
    ];
  }, [chunkName, selectedResource, currentLocation.x, currentLocation.y]);

  return (
    <BasicPanelWrapper titleText="Scaner:" opacity={opacity}>
      <div>
        {memoData.map((data, index) => (
          <div
            className="list-selecting"
            key={index}
            onClick={() =>
              useGameStore.setState({
                message: `Scaner: ${data.title} ${data.value}`,
              })
            }
          >
            <div>{data.title}</div>
            <div>{data.value}</div>
          </div>
        ))}
      </div>
    </BasicPanelWrapper>
  );
};
