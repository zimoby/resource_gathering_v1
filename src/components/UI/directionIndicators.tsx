import { useGameStore } from "../../store/store";

export const DirectionIndicators = () => {
  const moveDirection = useGameStore((state) => state.moveDirection);
  const opacity = useGameStore(
    (state) => state.uiPanelsState.supportPanels.opacity,
  );

  return (
    <div className="absolute bottom-2 left-2 mr-1" style={{ opacity }}>
      <div className="grid grid-cols-2 gap-1">
        <div
          className={`bg-neutral-900 size-5 border border-uilines flex justify-center items-center uppercase text-2xs ${moveDirection.x === -1 ? "bg-uilines text-neutral-900" : "text-uitext"}`}
        >
          a
        </div>
        <div
          className={`bg-neutral-900 size-5 border border-uilines flex justify-center items-center uppercase text-2xs ${moveDirection.y === -1 ? "bg-uilines text-neutral-900" : "text-uitext"}`}
        >
          w
        </div>
        <div
          className={`bg-neutral-900 size-5 border border-uilines flex justify-center items-center uppercase text-2xs ${moveDirection.y === 1 ? "bg-uilines text-neutral-900" : "text-uitext"}`}
        >
          s
        </div>
        <div
          className={`bg-neutral-900 size-5 border border-uilines flex justify-center items-center uppercase text-2xs ${moveDirection.x === 1 ? "bg-uilines text-neutral-900" : "text-uitext"}`}
        >
          d
        </div>
      </div>
    </div>
  );
};
