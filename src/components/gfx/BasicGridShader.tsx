import { useEffect, useMemo, useRef } from "react";
import {
  DoubleSide,
  Color,
  Vector2,
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
} from "three";
import { useGameStore } from "../../store/store";
import { useFrame } from "@react-three/fiber";
import { useCalculateDeltas } from "../../utils/functions";
import { useIncreasingSpeed } from "../../effects/IncreaseSceneSpeed";

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float chunkSize;
  uniform float mapWidth;
  uniform float mapDepth;
  uniform vec2 offset;
  uniform float subGrids;
  uniform float lineWidth;
  uniform vec3 gridColor;
  uniform vec3 subGridColor;
  
  varying vec2 vUv;

  void main() {
    float xCorrection = (mapWidth - 1.0) * 0.5;
    float yCorrection = (mapDepth - 1.0) * 0.5;
    
    vec2 scaledUv = vec2(vUv.x * mapWidth, vUv.y * mapDepth);
    vec2 coord = (scaledUv + (offset - vec2(xCorrection, yCorrection)) / chunkSize) * chunkSize;


    vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
    float line = min(grid.x, grid.y);

    vec2 subGrid = abs(fract(coord * subGrids - 0.5) - 0.5) / fwidth(coord * subGrids);
    float subLine = min(subGrid.x, subGrid.y);

    float alpha = 1.0 - min(line, 1.0);
    float subAlpha = 1.0 - min(subLine, 1.0);

    vec3 color = mix(subGridColor, gridColor, step(lineWidth * 1.0, line));
    color = mix(color, vec3(0.0), step(lineWidth, subLine));

    gl_FragColor = vec4(color, max(alpha, subAlpha));
  }
`;

export interface BasicGridShaderProps {
  position?: [number, number, number];
}

export const BasicGridShader = ({
  position = [0, 0, 0],
}: BasicGridShaderProps) => {
  const { width, depth } = useGameStore((state) => state.mapParams);
  const resetValues = useGameStore((state) => state.resetValues);
  const gridConfig = useGameStore((state) => state.gridConfig);
  const planeRef = useRef<Mesh>(null);
  const offset = useRef({ x: 0, y: 0 });

  const { deltaX, deltaY } = useCalculateDeltas();
  const { speedRef: increasingSpeedRef } = useIncreasingSpeed(0, 1, 0.01, 2);

  useEffect(() => {
    generateGridGeometry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, depth, gridConfig]);

  const generateGridGeometry = useMemo(() => {
    const planeGeometry = new PlaneGeometry(width, depth, 1, 1);
    const planeMaterial = new ShaderMaterial({
      uniforms: {
        mapWidth: { value: width / 100 },
        mapDepth: { value: depth / 100 },
        chunkSize: { value: gridConfig.chunkSize },
        offset: { value: new Vector2(0, 0) },
        subGrids: { value: gridConfig.subGrids },
        lineWidth: { value: gridConfig.lineWidth },
        gridColor: { value: new Color(gridConfig.gridColor) },
        subGridColor: { value: new Color(gridConfig.subGridColor) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      side: DoubleSide,
      depthWrite: false,
    });

    return () => {
      if (planeRef.current) {
        planeRef.current.geometry = planeGeometry;
        planeRef.current.material = planeMaterial;
      }
    };
  }, [
    width,
    depth,
    gridConfig.chunkSize,
    gridConfig.subGrids,
    gridConfig.lineWidth,
    gridConfig.gridColor,
    gridConfig.subGridColor,
    planeRef,
  ]);

  useFrame((_, delta) => {
    if (resetValues) {
      offset.current.x = 0;
      offset.current.y = 0;
    }

    offset.current.x += deltaX * (delta * 100) * increasingSpeedRef.current;
    offset.current.y += deltaY * (delta * 100) * increasingSpeedRef.current;

    if (
      planeRef.current &&
      planeRef.current.material instanceof ShaderMaterial &&
      planeRef.current.material.uniforms.offset?.value instanceof Vector2
    ) {
      const offsetValue = planeRef.current.material.uniforms.offset.value;
      offsetValue.set(offset.current.x * 0.01, -offset.current.y * 0.01);
    }
  });

  return (
    <group position={position}>
      <mesh ref={planeRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry />
        <shaderMaterial />
      </mesh>
    </group>
  );
};
