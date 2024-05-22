import { useEffect } from "react";
import { useGameStore, DEV_MODE } from "../store/store";
import { ChunkType } from "../store/gameStateSlice";

export const consoleLog = (message: string, data?: object) => {
  DEV_MODE && data ? console.log(message, { ...data }) : console.log(message);
};

export const useCheckVariableRender = (
  variable: object | string | number | boolean,
  name: string
) => {
  useEffect(() => {
    if (typeof variable === "object") {
      consoleLog(name || `variable:`, { ...variable });
    } else {
      console.log(name || `variable:`, variable);
    }
  }, [name, variable]);
};

export const useCheckComponentRender = (name: string) => {
  useEffect(() => {
    console.log("CR: " + name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export const convertChunkCoordinateToName = (chunk: ChunkType) => {
  const ns = chunk.y >= 0 ? "N" : "S";
  const ew = chunk.x >= 0 ? "E" : "W";
  const absX = Math.abs(chunk.x);
  const absY = Math.abs(chunk.y);
  return `CH-${ew}${absX}${ns}${absY}`;
};

export const getChunkCoordinates = (globalX: number, globalY: number, chunkSize: number) => {
  const x = Math.floor(globalX / chunkSize);
  const y = Math.floor(globalY / chunkSize);
  return { x, y };
};

export const isOutOfBound = (
  position: { x: number; y: number; z?: number },
  width: number,
  depth: number,
  offsetX: number,
  offsetY: number
) => {
  const xOutOfBounds = position.x < -width / 2 + offsetX || position.x > width / 2 + offsetX;
  const yOutOfBounds = position.y < -depth / 2 + offsetY || position.y > depth / 2 + offsetY;
  return { x: xOutOfBounds, y: yOutOfBounds };
};

export const useCalculateDeltas = () => {
  const dynamicSpeed = useGameStore((state) => state.dynamicSpeed);
  const { speed } = useGameStore((state) => state.mapParams);
  const direction = useGameStore((state) => state.moveDirection);
  const invertDirection = useGameStore((state) => state.invertDirection);

  const directionXY = invertDirection ? -1 : 1;

  const deltaX = direction.x * directionXY * (speed * dynamicSpeed);
  const deltaY = direction.y * directionXY * (speed * dynamicSpeed);

  return { deltaX, deltaY };
};

export const useUpdateMapMoving = () => {
  const { width, depth, offsetX, offsetY } = useGameStore((state) => state.mapParams);
  const currentLocation = useGameStore((state) => state.currentLocation);
  const currentOffset = useGameStore((state) => state.currentOffset);

  const updateLocationAndOffset = (offset: { current: { x: number; y: number } }) => {
    const currentChunk = getChunkCoordinates(
      offset.current.x + offsetX + width / 2,
      offset.current.y + offsetY + depth / 2,
      width
    );

    if (currentLocation.x !== currentChunk.x || currentLocation.y !== currentChunk.y) {
      useGameStore.setState({
        currentLocation: { x: currentChunk.x, y: currentChunk.y },
      });
    }

    const roundedOffset = {
      x: Math.round(offset.current.x),
      y: Math.round(offset.current.y),
    };

    if (currentOffset.x !== roundedOffset.x || currentOffset.y !== roundedOffset.y) {
      useGameStore.setState({
        currentOffset: { x: roundedOffset.x, y: roundedOffset.y },
      });
    }
  };

  return { updateLocationAndOffset };
};

export const numberSimplified = (number: number) => {
  if (number < 1000) return number;
  if (number < 1000000) return `${(number / 1000).toFixed(1)}k`;
  return `${(number / 1000000).toFixed(1)}M`;
};

