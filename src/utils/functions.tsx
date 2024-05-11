import { useEffect } from "react";
import { useGameStore, ChunkType, DEV_MODE } from "../store";

export const consoleLog = (message: string, data?: object) => {
  DEV_MODE && console.log(message, { ...data});
}

export const useCheckVariableRender = ({variable, name}: {variable: object | string | number | boolean, name: string}) => {
  useEffect(() => {

    if (typeof variable === "object") {
      consoleLog(name || `variable:`, { ...variable });
    } else {
      console.log(name || `variable:`, variable);
    }

  }, [name, variable]);
}

export const useCheckComponentRender = (name: string) => {
  useEffect(() => {
    // consoleLog(name);
    console.log(name);
  }, []);
}

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
  position: { x: number; y: number; z?: number; },
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

  const deltaX = direction.x * (speed * dynamicSpeed);
  const deltaY = direction.y * (speed * dynamicSpeed);

  return { deltaX, deltaY };
};

export const useUpdateMapMoving = () => {
  const { width, depth, offsetX, offsetY } = useGameStore((state) => state.mapParams);

  const updateLocationAndOffset = (offset: { current: { x: number; y: number; }; }) => {

    const currentChunk = getChunkCoordinates(
      offset.current.x + offsetX + width / 2,
      offset.current.y + offsetY + depth / 2,
      width
    );

    useGameStore.setState({
      currentLocation: { x: currentChunk.x, y: currentChunk.y },
      currentOffset: { x: offset.current.x, y: offset.current.y },
    });
  }

  return { updateLocationAndOffset };
};