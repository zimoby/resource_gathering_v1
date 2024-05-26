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
  // const currentOffset = useGameStore((state) => state.currentOffset);
  // const activePosition = useGameStore((state) => state.activePosition);

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
      // {
      //   title: "Active Position:",
      //   value:
      //     Math.round(activePosition.x) +
      //     ":" +
      //     Math.round(activePosition.z) +
      //     ":" +
      //     Math.round(activePosition.y),
      // },
      // {
      //   title: "Current Offset:",
      //   value: Math.round(currentOffset.x) + ":" + Math.round(currentOffset.y),
      // },
    ];
  }, [
    chunkName,
    selectedResource,
    currentLocation.x,
    currentLocation.y,
    // activePosition.x,
    // activePosition.z,
    // activePosition.y,
    // currentOffset.x,
    // currentOffset.y,
  ]);

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
