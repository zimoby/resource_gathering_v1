import { useMemo } from "react";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Color
} from "three";
import { useControls } from "leva";

export const ChunkGrid = ({ position, sizeExtend = 0 }) => {
  const { width, depth } = useControls({
    width: { value: 100, min: 50, max: 200 },
    depth: { value: 100, min: 50, max: 200 },
  });

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

    // geometry.dispose();

    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));

    geometry.setIndex([0, 1, 1, 2, 2, 3, 3, 0]);

    return geometry;
  }, [width, depth]);

  return (
    <lineSegments geometry={gridGeometry} position={position}>
      <lineBasicMaterial vertexColors />
    </lineSegments>
  );
};
