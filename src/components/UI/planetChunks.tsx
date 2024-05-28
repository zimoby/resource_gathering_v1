import React, { useMemo, useState } from "react";
import { useGameStore } from "../../store/store";
// import { useCheckVariableRender } from "../../utils/functions";

type GridCell = "empty" | "visited" | "artifact";

interface MinimapCellProps {
  cellType: "empty" | "visited" | "artifact";
}

const MinimapCell: React.FC<MinimapCellProps> = React.memo(({ cellType }) => {
  let bgColor = "";

  switch (cellType) {
    case "visited":
      bgColor = "bg-uilines";
      break;
    case "artifact":
      bgColor = "bg-red-500";
      break;
    default:
      bgColor = "";
  }

  return (
    <div className={`w-4 h-4 ${bgColor} `}>
      <div className={`w-4 h-4 border border-uilines opacity-30`} />
    </div>
  );
});

MinimapCell.displayName = "MinimapCell";

export const PlanetChunks = () => {
  const locationsHistory = useGameStore((state) => state.locationsHistory);
  const currentLocation = useGameStore((state) => state.currentLocation);
  const artifacts = useGameStore((state) => state.artifacts);
  const opacity = useGameStore(
    (state) => state.uiPanelsState.supportPanels.opacity,
  );

  const [gridSize, setGridSize] = useState(5);
  const halfGridSize = Math.floor(gridSize / 2);

  // useCheckVariableRender(artifacts, "artifacts");

  const grid = useMemo<GridCell[][]>(() => {
    const newGrid: GridCell[][] = Array.from({ length: gridSize }, () =>
      Array<GridCell>(gridSize).fill("empty"),
    );

    locationsHistory.forEach((location) => {
      const offsetX = location.x - currentLocation.x + halfGridSize;
      const offsetY = location.y - currentLocation.y + halfGridSize;

      if (
        offsetX >= 0 &&
        offsetX < gridSize &&
        offsetY >= 0 &&
        offsetY < gridSize
      ) {
        newGrid[offsetY][offsetX] = "visited";
      }
    });

    artifacts.forEach((artifact) => {
      const offsetX = artifact.chunkX - currentLocation.x + halfGridSize;
      const offsetY = artifact.chunkY - currentLocation.y + halfGridSize;

      if (
        offsetX >= 0 &&
        offsetX < gridSize &&
        offsetY >= 0 &&
        offsetY < gridSize &&
        newGrid[offsetY][offsetX] === "visited"
      ) {
        newGrid[offsetY][offsetX] = "artifact";
      }
    });

    // console.log("newGrid", newGrid);

    return newGrid;
  }, [
    gridSize,
    locationsHistory,
    artifacts,
    currentLocation.x,
    currentLocation.y,
    halfGridSize,
  ]);

  return (
    <div className="relative inline-block" style={{ opacity }}>
      <div className="absolute top-0 right-0 size-7 border-r-2 border-t-2 border-t-uilines border-r-uilines -m-3 hover:border-t-neutral-100 hover:border-r-neutral-100 hover:-m-5  cursor-pointer"
        onClick={() => setGridSize((prev) => prev + 2)}
      />
      {/* <div className="absolute top-0 right-0 size-7 border-r-2 border-t-2 border-t-uilines border-r-uilines -m-6 hover:border-t-neutral-100 hover:border-r-neutral-100 hover:-m-8 cursor-pointer"
        onClick={() => setGridSize(() => 21)}
      /> */}
      <div className="absolute left-0 bottom-0 size-7 border-r-2 border-t-2 border-t-uilines border-r-uilines -m-3 rotate-180 hover:border-t-neutral-100 hover:border-r-neutral-100 hover:-m-5  cursor-pointer"
        onClick={() => setGridSize((prev) => prev - 2)}
      />
      <div className="size-full border border-uilines">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, cellIndex) => (
              <MinimapCell key={cellIndex} cellType={cell} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
