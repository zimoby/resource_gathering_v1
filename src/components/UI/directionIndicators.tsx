import { useGameStore } from "../../store/store";

export const DirectionIndicators = () => {
  const moveDirection = useGameStore((state) => state.moveDirection);
  const opacity = useGameStore(
    (state) => state.uiPanelsState.supportPanels.opacity,
  );

  return (
    <div className="mx-6 my-4" style={{ opacity }}>
      <div className="size-12 grid grid-cols-2  -rotate-45">
        <div
          className={`bg-neutral-900 size-5 border border-uilines flex justify-center items-center uppercase text-2xs ${moveDirection.x === -1 ? "bg-uilines text-neutral-900" : "text-uitext"}`}
        >
          <p className="rotate-45">a</p>
        </div>
        <div
          className={`bg-neutral-900 size-5 border border-uilines flex justify-center items-center uppercase text-2xs ${moveDirection.y === -1 ? "bg-uilines text-neutral-900" : "text-uitext"}`}
        >
          <p className="rotate-45">w</p>
        </div>
        <div
          className={`bg-neutral-900 size-5 border border-uilines flex justify-center items-center uppercase text-2xs ${moveDirection.y === 1 ? "bg-uilines text-neutral-900" : "text-uitext"}`}
        >
          <p className="rotate-45">s</p>
        </div>
        <div
          className={`bg-neutral-900 size-5 border border-uilines flex justify-center items-center uppercase text-2xs ${moveDirection.x === 1 ? "bg-uilines text-neutral-900" : "text-uitext"}`}
        >
          <p className="rotate-45">d</p>
        </div>
      </div>
    </div>
  );
};
