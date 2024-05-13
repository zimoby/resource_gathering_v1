import { useGameStore } from "../../store";

export const TitlePanel = () => {
  const uiPanelsState = useGameStore((state) => state.uiPanelsState);
  const worldParams = useGameStore((state) => state.worldParams);

  {/* <div className="w-fit h-fit mb-1 border border-neutral-200 p-1 text-xs bg-neutral-900 text-neutral-200"> */}

  return <div
    className="w-96 h-16 border border-neutral-200 text-xs  text-neutral-200"
    style={{ opacity: uiPanelsState.titlePanel.opacity}}
  >
    <div className="h-full w-full px-1 content-end orbitron text-2xl text-end uppercase text-neutral-200">
      {`Planet-${worldParams.seed}`}
    </div>
  </div>;
};
