import { useGameStore } from "../../store";
import { BasicPanelWrapper } from "./BasicPanelWrapper";

const numberSimplified = (number: number) => {
  if (number < 1000) return number;
  if (number < 1000000) return `${(number / 1000).toFixed(1)}k`;
  return `${(number / 1000000).toFixed(1)}M`;
}

export const CollectedResourcesPanel = () => {
  const opacity = useGameStore((state) => state.uiPanelsState.collectedResourcesPanel.opacity);
  const collectedResources = useGameStore((state) => state.collectedResources);

  return (
    <BasicPanelWrapper titleText="Collected Resources:" opacity={opacity}>
      <div className="w-full p-1 flex flex-wrap justify-center items-center">
        {Object.entries(collectedResources).map(([resource, count]) => (
          <div key={resource} className="w-1/2 h-12 flex flex-col text-center justify-start items-center">
            <div className="orbitron text-2xl">{numberSimplified(count)}</div>
            <div className=" text-xs leading-3">{resource}</div>
          </div>
        ))}
      </div>
    </BasicPanelWrapper>
  );
};
