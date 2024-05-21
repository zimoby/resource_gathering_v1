import { useGameStore } from "../../../store";
import { BasicPanelWrapper } from "../BasicPanelWrapper";


export const CostsPanel = () => {
  const opacity = useGameStore((state) => state.uiPanelsState.logsPanel.opacity);
  const costs = useGameStore((state) => state.costs);

  return (
    <BasicPanelWrapper titleText="Costs:" styles="" opacity={opacity}>
      { Object.keys(costs).map((cost, index) => (
        <div
          key={index}
          className="list-selecting flex flex-row justify-between w-full pr-4"
          onClick={() => useGameStore.setState({ message: `Cost: ${costs[cost].name}` })}
        >
          <div className="w-2/3">
            {costs[cost].name}:
          </div>
          <div className=" ml-2 w-1/4">
            {costs[cost].value}
          </div>
        </div>
      ))}
    </BasicPanelWrapper>
  );
};
