import { useGameStore } from "../../../store/store";

export const TitlePanel = () => {
  const uiPanelsState = useGameStore((state) => state.uiPanelsState);
  const worldParams = useGameStore((state) => state.worldParams);

  return (
    <div
      className="w-[20rem] h-16 border text-xs text-uitext flex flex-wrap justify-end items-end px-1 bg-neutral-900 border-uilines"
      style={{ opacity: uiPanelsState.titlePanel.opacity }}
    >
      <div className="h-fit w-full px-1 content-end orbitron text-2xl text-end uppercase leading-6 text-uitext">
        {`Planet-${worldParams.seed.value}`}
      </div>
    </div>
  );
};
