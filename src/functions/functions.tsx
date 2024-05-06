export const convertChunkCoordinateToName = (chunk) => {
  const ns = chunk.y >= 0 ? "N" : "S";
  const ew = chunk.x >= 0 ? "E" : "W";
  const absX = Math.abs(chunk.x);
  const absY = Math.abs(chunk.y);
  return `CH-${ew}${absX}${ns}${absY}`;
};

export const getChunkCoordinates = (globalX: number, globalY: number, chunkSize: number) => {
  const chunkX = Math.floor(globalX / chunkSize);
  const chunkY = Math.floor(globalY / chunkSize);
  return { chunkX, chunkY };
};

export const isOutOfBound = (
  position: { x: any; y?: any; z: any; },
  width: number,
  depth: number,
  offsetX: number,
  offsetY: number
) => {
  return (
    position.x < -width / 2 + offsetX ||
    position.x > width / 2 + offsetX ||
    position.z < -depth / 2 + offsetY ||
    position.z > depth / 2 + offsetY
  );
};

