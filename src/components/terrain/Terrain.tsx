import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  DoubleSide,
  BufferGeometry,
  Float32BufferAttribute,
  Raycaster,
  BufferAttribute,
  Mesh,
} from "three";
import { useGameStore } from "../../store/store";
import { useKeyboardControls } from "../../hooks/intereaction";
import { useCanvasHover } from "../../hooks/intereaction";
import { generateTerrain } from "./generateTerrain";

import { NoiseFunction2D, createNoise2D } from "simplex-noise";
import seedrandom from "seedrandom";
import {
  useCalculateDeltas,
  useResetOffset,
  useUpdateMapMoving,
} from "../../utils/functions";
import { useIncreasingSpeed } from "../../effects/IncreaseSceneSpeed";
import { ResourceType } from "../../store/worldParamsSlice";

const generateIndices = (
  widthCount: number,
  depthCount: number,
  indices: Uint16Array,
) => {
  let index = 0;
  for (let i = 0; i < depthCount; i++) {
    for (let j = 0; j < widthCount; j++) {
      if (i < depthCount && j < widthCount) {
        const a = i * (widthCount + 1) + j;
        const b = a + (widthCount + 1);

        indices[index++] = a;
        indices[index++] = b;
        indices[index++] = a + 1;

        indices[index++] = b;
        indices[index++] = b + 1;
        indices[index++] = a + 1;
      }
    }
  }
};

export const Terrain = () => {
  const terrainLoading = useGameStore((state) => state.terrainLoading);
  const { width, depth, resolution, scale, offsetX, offsetY } = useGameStore(
    (state) => state.mapParams,
  );
  const seed = useGameStore((state) => state.worldParams.seed);
  const mapDetailes = useGameStore((state) => state.worldParams.mapDetailes);
  const canPlaceBeacon = useGameStore((state) => state.canPlaceBeacon);
  const scanRadius = useGameStore((state) => state.scanRadius);
  const activePosition = useGameStore((state) => state.activePosition);
  const playerPoints = useGameStore((state) => state.playerPoints);
  const terrainColors = useGameStore((state) => state.terrainColors);

  const widthCount = Math.floor(width / resolution);
  const depthCount = Math.floor(depth / resolution) + 1;

  const { camera } = useThree();

  const meshRef = useRef<Mesh>(null);
  const offset = useRef({ x: 0, y: 0 });

  const colors = useRef(
    new Float32Array((widthCount + 1) * (depthCount + 1) * 3),
  );
  const positions = useRef(
    new Float32Array((widthCount + 1) * (depthCount + 1) * 3),
  );
  const resources = useRef<ResourceType[]>(
    new Array<ResourceType>((widthCount + 1) * (depthCount + 1)).fill("empty"),
  );

  const indices = useMemo(() => {
    const indicesPrecalc = new Uint16Array(widthCount * depthCount * 6);
    generateIndices(widthCount, depthCount, indicesPrecalc);
    return indicesPrecalc;
  }, [widthCount, depthCount]);

  const noise2D: NoiseFunction2D = useMemo(
    () => createNoise2D(seedrandom(seed.value)),
    [seed],
  );

  const raycaster = useRef(new Raycaster());
  const terrainGeometry = useRef(new BufferGeometry());
  const colorAttribute = useRef(new Float32BufferAttribute(colors.current, 3));
  const indexAttribute = useRef(new BufferAttribute(indices, 1));

  useKeyboardControls({ camera, raycaster: raycaster.current, meshRef });
  useCanvasHover({ camera, raycaster: raycaster.current, meshRef, resources });

  const updateTerrainGeometry = () => {
    const { colors: generatedColors, resources: generatedResources } =
      generateTerrain(
        width,
        depth,
        resolution,
        scale,
        noise2D,
        offset.current.x + offsetX,
        offset.current.y + offsetY,
        terrainGeometry.current,
        canPlaceBeacon && playerPoints >= 50,
        activePosition,
        scanRadius,
        resources.current,
        colors.current,
        positions.current,
        widthCount,
        depthCount,
        terrainColors,
        mapDetailes,
      );

    colorAttribute.current.array = generatedColors;
    colorAttribute.current.needsUpdate = true;

    indexAttribute.current.array = indices;
    indexAttribute.current.needsUpdate = true;

    terrainGeometry.current.setIndex(indexAttribute.current);
    terrainGeometry.current.setAttribute("color", colorAttribute.current);
    resources.current = generatedResources;

    if (meshRef.current) {
      meshRef.current.geometry = terrainGeometry.current;
    }

    return resources.current;
  };

  const { deltaX, deltaY } = useCalculateDeltas();
  const { updateLocationAndOffset } = useUpdateMapMoving();
  useResetOffset(offset);
  const { speedRef: increasingSpeedRef } = useIncreasingSpeed(0, 1, 0.01, 2);

  useFrame((_, delta) => {
    offset.current.x += deltaX * (delta * 100) * increasingSpeedRef.current;
    offset.current.y += deltaY * (delta * 100) * increasingSpeedRef.current;

    updateLocationAndOffset(offset);

    const resources = updateTerrainGeometry();

    if (resources[0] !== null && terrainLoading) {
      useGameStore.setState({ terrainLoading: false });
    }
  });

  return (
    <mesh ref={meshRef} geometry={terrainGeometry.current}>
      <meshStandardMaterial wireframe={true} vertexColors side={DoubleSide} />
    </mesh>
  );
};
