import React, { useEffect, useMemo, useRef, useState } from "react";
import { useGameStore } from "../../store/store";
// import { useCheckVariableRender } from "../../utils/functions";
// import { useCheckVariableRender } from "../../utils/functions";

type GridCell = "empty" | "visited" | "artifact" | "current";

interface MinimapCellProps {
  cellType: GridCell;
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
    case "current":
      bgColor = "bg-neutral-100";
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

export const PlanetChunks = ({ size = 5, hideControls = false }) => {
  const locationsHistory = useGameStore((state) => state.locationsHistory);
  const currentLocation = useGameStore((state) => state.currentLocation);
  const artifacts = useGameStore((state) => state.artifacts);
  const opacity = useGameStore(
    (state) => state.uiPanelsState.supportPanels.opacity,
  );

  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const [gridSize, setGridSize] = useState(size);
  const halfGridSize = Math.floor(gridSize / 2);

  const toggleModal = useGameStore((state) => state.toggleModal);

  // useCheckVariableRender(offset, "offset");

  const handleMouseDown = (event: React.MouseEvent) => {
    setDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (dragging && hideControls) {
      const deltaX = event.clientX - dragStart.x;
      const deltaY = event.clientY - dragStart.y;
      setOffset({ x: offset.x + deltaX, y: offset.y + deltaY });
      setDragStart({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging, dragStart]);

  // useCheckVariableRender(artifacts, "artifacts");

  const grid = useMemo<GridCell[][]>(() => {
    const newGrid: GridCell[][] = Array.from({ length: gridSize }, () =>
      Array<GridCell>(gridSize).fill("empty"),
    );

    locationsHistory.forEach((location) => {
      const offsetX = Math.round(
        location.x - currentLocation.x + halfGridSize + offset.x / 10,
      );
      const offsetY = Math.round(
        location.y - currentLocation.y + halfGridSize + offset.y / 10,
      );

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
      const offsetX = Math.round(
        artifact.chunkX - currentLocation.x + halfGridSize + offset.x / 10,
      );
      const offsetY = Math.round(
        artifact.chunkY - currentLocation.y + halfGridSize + offset.y / 10,
      );

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

    const currentX = Math.round(halfGridSize + offset.x / 10);
    const currentY = Math.round(halfGridSize + offset.y / 10);
    if (
      currentX >= 0 &&
      currentX < gridSize &&
      currentY >= 0 &&
      currentY < gridSize
    ) {
      newGrid[currentY][currentX] = "current";
    }

    // console.log("newGrid", newGrid);

    return newGrid;
  }, [
    gridSize,
    locationsHistory,
    artifacts,
    currentLocation.x,
    currentLocation.y,
    halfGridSize,
    offset.x,
    offset.y,
  ]);

  return (
    <div
      className="relative inline-block"
      style={{ opacity }}
      ref={containerRef}
      onMouseDown={handleMouseDown}
    >
      {/* <div className="absolute top-0 right-0 size-7 border-r-2 border-t-2 border-t-uilines border-r-uilines -m-6 hover:border-t-neutral-100 hover:border-r-neutral-100 hover:-m-8 cursor-pointer"
        onClick={() => setGridSize(() => 21)}
      /> */}
      {!hideControls && (
        <>
          <div
            className="absolute top-0 right-0 size-7 border-r-2 border-t-2 border-t-uilines border-r-uilines -m-3 hover:border-t-neutral-100 hover:border-r-neutral-100 hover:-m-5  cursor-pointer"
            onClick={() => setGridSize((prev) => prev + 2)}
          />
          <div
            className="absolute left-0 bottom-0 size-7 border-r-2 border-t-2 border-t-uilines border-r-uilines -m-3 rotate-180 hover:border-t-neutral-100 hover:border-r-neutral-100 hover:-m-5  cursor-pointer"
            onClick={() => setGridSize((prev) => prev - 2)}
          />
        </>
      )}
      <div
        className="size-full border border-uilines cursor-pointer"
        onClick={() => {
          if (!hideControls) {
            toggleModal("showMapModal");
          }
        }}
      >
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
