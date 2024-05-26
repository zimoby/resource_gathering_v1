import { useMemo } from "react";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Color,
  Vector3,
  Euler,
} from "three";

export const Line = ({
  width = 1,
  position = [0, 0, 0],
  rotation = new Euler(0, 0, 0),
  sizeExtend = 0,
}: {
  width?: number;
  position?: number[];
  rotation?: Euler;
  sizeExtend?: number;
}) => {
  const gridGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    const positions = [];
    const colors = [];

    const gridColor = new Color(16777215);

    positions.push(
      -(width + sizeExtend) / 2,
      0,
      0,
      (width + sizeExtend) / 2,
      0,
      0,
    );

    colors.push(
      gridColor.r,
      gridColor.g,
      gridColor.b,
      gridColor.r,
      gridColor.g,
      gridColor.b,
    );

    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));

    geometry.setIndex([0, 1]);

    return geometry;
  }, [width, sizeExtend]);

  return (
    <lineSegments
      rotation={rotation}
      geometry={gridGeometry}
      position={new Vector3(position[0], position[1], position[2])}
    >
      <lineBasicMaterial vertexColors />
    </lineSegments>
  );
};
