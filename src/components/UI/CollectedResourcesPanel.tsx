import { useGameStore } from "../../store";
import { BasicPanelWrapper } from "./BasicPanelWrapper";

export const CollectedResourcesPanel = () => {
  const opacity = useGameStore((state) => state.uiPanelsState.collectedResourcesPanel.opacity);
  const collectedResources = useGameStore((state) => state.collectedResources);

  return (
    <BasicPanelWrapper titleText="Collected Resources:" opacity={opacity}>
      {Object.entries(collectedResources).map(([resource, count]) => (
        <div key={resource}>
          {resource}: {count}
        </div>
      ))}
    </BasicPanelWrapper>
  );
};
