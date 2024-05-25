import { useGameStore } from "../../store/store";

export const EmptyGrowPanel: React.FC = () => {
  const opacity = useGameStore((state) => state.uiPanelsState.emptyPanel.opacity);
  return (
    <div
      className=" flex flex-grow aug-border-yellow-500"
      data-augmented-ui={`border bl-clip tl-clip tr-clip --aug-border-bg`}
			style={{ opacity }}
    />
  );
};
