import { useGameStore } from "../../store";

export const TitlePanel = () => {
  const uiPanelsState = useGameStore((state) => state.uiPanelsState);
  const worldParams = useGameStore((state) => state.worldParams);

  return <div
    className="w-[40rem] h-16 border border-uilines text-xs text-uitext"
    style={{ opacity: uiPanelsState.titlePanel.opacity}}
  >
    <div className="h-full w-full px-1 content-end orbitron text-2xl text-end uppercase leading-6 text-uitext">
      {`Planet-${worldParams.seed}`}
    </div>
  </div>;
};
