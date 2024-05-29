import { useMemo } from "react";
import { useGameStore } from "../../../store/store";
import {
  parseResourcesColors,
  resourceNames,
} from "../../../store/worldParamsSlice";

export const SinePanel = () => {
  const collectedResources = useGameStore((state) => state.collectedResources);
  const opacity = useGameStore(
    (state) => state.uiPanelsState.supportPanels.opacity,
  );
  const parsedResourcesColors = useMemo(() => parseResourcesColors(), []);

  const resourcePaths = useMemo(() => {
    return resourceNames.map((resourceName, index) => ({
      resourceName,
      path: (
        <path
          key={resourceName}
          id={`repeating-group-${index + 1}`}
          d="M 0,5 Q 12.5,0 25,5 T 50,5 T 75,5 T 100,5 T 125,5 T 150,5 T 175,5 T 200,5"
          fill="transparent"
          stroke={`rgba(${parsedResourcesColors[index].color[0] * 255}, ${
            parsedResourcesColors[index].color[1] * 255
          }, ${parsedResourcesColors[index].color[2] * 255})`}
          strokeWidth="0.5"
          style={{
            transform: `scaleY(${Math.min(
              collectedResources[resourceName] / 100,
              1,
            )})`,
            transformOrigin: "center",
          }}
        />
      ),
    }));
  }, [collectedResources, parsedResourcesColors]);

  return (
    <div
      className="w-72 h-full border border-uilines overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--color-uitext) 0.5px, transparent 0.5px), linear-gradient(to bottom, var(--color-uitext) 0.5px, transparent 0.5px)",
        backgroundSize: "1rem 1rem",
        opacity,
      }}
    >
      <svg
        width="200%"
        height="100%"
        viewBox="0 0 200 10"
        preserveAspectRatio="none"
      >
        {resourcePaths.map(({ path, resourceName }) => (
          <g key={resourceName}>{path}</g>
        ))}
      </svg>
    </div>
  );
};
