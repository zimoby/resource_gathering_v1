import { useGameStore } from "../../store";
import { maxLevel, minLevel } from "../../store/worldParamsSlice";

export const LevelsIndicators = () => {
  const activePosition = useGameStore((state) => state.activePosition);

  const posHeightRange = Math.max(
    0,
    Math.min(100, (activePosition.y - 1 - minLevel) * (100 / (maxLevel - minLevel)))
  );

  return (
    <div className="absolute top-2 right-2">
      <div className="flex flex-col space-y-1 justify-center items-center">
        <p className="text-uitext">Z</p>
        <div
          className=" h-28 w-3 border border-uilines"
          style={{
            background: `linear-gradient( to top, var(--color-uilines) 0%, var(--color-uilines) ${posHeightRange}%, rgba(255, 255, 255, 0) ${posHeightRange}%)`,
            // opacity: `0.5`
          }}
        />
      </div>
    </div>
  );
};
