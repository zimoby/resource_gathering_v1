import { movementDirections } from "../../../store/gameStateSlice";
import { useGameStore } from "../../../store/store";

export const DirectionIndicators = () => {
  const moveDirection = useGameStore((state) => state.moveDirection);
  const opacity = useGameStore(
    (state) => state.uiPanelsState.supportPanels.opacity,
  );

  const handleDirectionClick = (direction: number) => {
    useGameStore.setState({ moveDirection: movementDirections[direction] });
  };

  return (
    <div className="mx-6 my-4" style={{ opacity }}>
      <div className="size-12 grid grid-cols-2 -rotate-45">
        {movementDirections.map((direction, index) => (
          <div
            key={index}
            className={`bg-neutral-900 size-5 border border-uilines flex justify-center items-center uppercase text-2xs cursor-pointer hover:bg-uilines hover:text-neutral-900 ${
              moveDirection.x === direction.x && moveDirection.y === direction.y
                ? "bg-uilines text-neutral-900"
                : "text-uitext"
            }`}
            onClick={() => handleDirectionClick(index)}
          >
            <p className="rotate-45">{direction.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
