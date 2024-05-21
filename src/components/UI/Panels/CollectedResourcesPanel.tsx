import { useGameStore } from "../../../store/store";
import { numberSimplified } from "../../../utils/functions";
import { BasicPanelWrapper } from "../BasicPanelWrapper";

export const CollectedResourcesPanel = () => {
  const opacity = useGameStore((state) => state.uiPanelsState.collectedResourcesPanel.opacity);
  const collectedResources = useGameStore((state) => state.collectedResources);

  return (
    <BasicPanelWrapper titleText="Collected Resources:" opacity={opacity}>
      <div className="w-full p-1 m-0 flex flex-wrap justify-center items-center">
        {Object.entries(collectedResources).map(([resource, count]) => (
          <div
            key={resource}
            className="w-1/2 flex flex-col text-center justify-start items-center hover:bg-uilines hover:text-neutral-900"
            onClick={() => useGameStore.setState({ message: `Collected Resources: ${resource}: ${count}` })}
          >
            <div className="orbitron text-2xl">{numberSimplified(count)}</div>
            <div className=" text-xs leading-3">{resource}</div>
          </div>
        ))}
      </div>
    </BasicPanelWrapper>
  );
};
