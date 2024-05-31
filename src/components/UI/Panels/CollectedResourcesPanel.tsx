import { useMemo, useState } from "react";
import { useGameStore } from "../../../store/store";
import { numberSimplified } from "../../../utils/functions";
import { BasicPanelWrapper } from "../BasicPanelWrapper";
import { parseResourcesColors } from "../../../store/worldParamsSlice";

export const CollectedResourcesPanel = () => {
  const opacity = useGameStore(
    (state) => state.uiPanelsState.collectedResourcesPanel.opacity,
  );
  const collectedResources = useGameStore((state) => state.collectedResources);
  const [hoveredResource, setHoveredResource] = useState<string | null>(null);

  const parsedResourcesColors = useMemo(() => {
    return parseResourcesColors();
  }, []);

  return (
    <BasicPanelWrapper titleText="Collected Resources:" opacity={opacity}>
      <div className="w-full p-1 m-0 flex flex-wrap justify-center items-center">
        {Object.entries(collectedResources).map(([resource, count], index) => (
          <div
            key={resource}
            className="w-1/2 flex flex-col text-center justify-start items-center"
            onMouseEnter={() => setHoveredResource(resource)}
            onMouseLeave={() => setHoveredResource(null)}
            style={{
              backgroundColor:
                hoveredResource && hoveredResource === resource
                  ? `rgba(${parsedResourcesColors[index].color[0] * 255} ${parsedResourcesColors[index].color[1] * 255} ${
                      parsedResourcesColors[index].color[2] * 255
                    })`
                  : "transparent",
            }}
            onClick={() =>
              useGameStore.setState({
                message: `Collected Resources: ${resource}: ${count}`,
              })
            }
          >
            <div className="orbitron text-2xl">{numberSimplified(count)}</div>
            <div className=" text-xs leading-3">{resource}</div>
          </div>
        ))}
      </div>
    </BasicPanelWrapper>
  );
};
