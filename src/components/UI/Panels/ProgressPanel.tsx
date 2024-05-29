import { useGameStore } from "../../../store/store";

export const ProgressBlock = () => {
  const playerPoints = useGameStore((state) => state.playerPoints);
  const opacity = useGameStore(
    (state) => state.uiPanelsState.progressPanel.opacity,
  );

  const goal = 20000;

  const progressPercent = (playerPoints / goal) * 100;
  const blockWidths = [44, 20, 12, 4];

  const blockFills = blockWidths.map((width) => {
    const fill = Math.max(
      0,
      Math.min(
        width,
        progressPercent -
          blockWidths
            .slice(0, blockWidths.indexOf(width))
            .reduce((acc, w) => acc + w, 0),
      ),
    );
    return (fill / width) * 100;
  });

  return (
    <div className="flex w-80 h-16 flex-col -space-y-1" style={{ opacity }}>
      <div className="flex w-full h-full flex-row space-x-0">
        {blockWidths.map((width, index) => (
          <div
            key={width + "_" + index}
            className={`relative w-${width} mb-1 h-auto border border-uilines hover:border-4`}
          >
            <div
              key={index}
              className={`absolute inset-0 h-full w-full`}
              style={{
                background: `linear-gradient(to right, var(--color-uilines) 0%, var(--color-uilines) ${blockFills[index]}%, rgba(255, 255, 255, 0) ${blockFills[index]}%, rgba(255, 255, 255, 0) 100%)`,
                opacity: `${0.5 * ((index + 1) / 2)}`,
              }}
              onClick={() =>
                useGameStore.setState({
                  message:
                    "Current energy level: " +
                    Math.floor((playerPoints / goal) * 100) +
                    "%",
                })
              }
            />
          </div>
        ))}
      </div>
      <div className="flex w-full h-4 justify-between px-1 border bg-uilines border-uilines orbitron text-end text-2xs uppercase text-neutral-900">
        <p>
          Energy: {playerPoints} / {goal}
        </p>
        <p>Progress</p>
      </div>
    </div>
  );
};
