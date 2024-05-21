import { useMemo } from "react";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Color,
  Vector3
} from "three";
import { useGameStore } from "../../store/store";

export const ChunkGrid = ({ position, sizeExtend = 0 }: {
  position: number[],
  sizeExtend?: number
}) => {
  const { width, depth } = useGameStore((state) => state.mapParams);

  const gridGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    const positions = [];
    const colors = [];

    const gridColor = new Color(16777215);

    positions.push(
      -(width + sizeExtend) / 2, 0, -(depth + sizeExtend) / 2,
      (width + sizeExtend) / 2, 0, -(depth + sizeExtend) / 2,
      (width + sizeExtend) / 2, 0, (depth + sizeExtend) / 2,
      -(width + sizeExtend) / 2, 0, (depth + sizeExtend) / 2
    );

    colors.push(
      gridColor.r, gridColor.g, gridColor.b,
      gridColor.r, gridColor.g, gridColor.b,
      gridColor.r, gridColor.g, gridColor.b,
      gridColor.r, gridColor.g, gridColor.b
    );

    geometry.dispose();

    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));

    geometry.setIndex([0, 1, 1, 2, 2, 3, 3, 0]);

    return geometry;
  }, [width, sizeExtend, depth]);

  return (
    <lineSegments geometry={gridGeometry} position={new Vector3(position[0], position[1], position[2])}>
      <lineBasicMaterial vertexColors />
    </lineSegments>
  );
};
