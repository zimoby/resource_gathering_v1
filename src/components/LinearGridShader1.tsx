import { useEffect, useMemo, useRef } from "react";
import { DoubleSide, Color, Vector2, PlaneGeometry, ShaderMaterial, Mesh } from "three";
import useGamaStore from "../store";

// import { vertexShader, fragmentShader } from './chunkGridShader';

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float chunkSize;
  uniform vec2 offset;
	uniform float subGridsX;
	uniform float subGridsY;
  uniform float lineWidth;
  uniform vec3 gridColor;
  uniform vec3 subGridColor;
	uniform vec2 gridSize;
  
  varying vec2 vUv;

	void main() {
    vec2 coord = (vUv + offset / chunkSize) * chunkSize;
    
    // Calculate edge fading with a sharp cutoff based on lineWidth
    float edgeFadeX = step(lineWidth / chunkSize, min(coord.x, gridSize.x - coord.x));
    float edgeFadeY = step(lineWidth / chunkSize, min(coord.y, gridSize.y - coord.y));
    float edgeFade = edgeFadeY;

    vec2 subGrid = abs(fract(vec2(coord.x * subGridsX, coord.y * subGridsY) - 0.5) - 0.5) / fwidth(vec2(coord.x * subGridsX, coord.y * subGridsY));
    float subLine = min(subGrid.x, subGrid.y);

    float subAlpha = (1.0 - min(subLine, 1.0)) * edgeFade;

    vec3 color = mix(vec3(0.0), subGridColor, step(lineWidth, subLine));

    gl_FragColor = vec4(color, subAlpha * 0.5);
}
`;

export const LinearGridShader = ({position = [0,0,0] as [number, number, number], sizeX = 100, sizeY = 100, width = 100, depth = 100}) => {
	const rulerRef = useRef<Mesh>(null);
  const gridConfig = useGamaStore((state) => state.gridConfig);

  useEffect(() => {
    generateRulerGeometry();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, depth, sizeX, sizeY, gridConfig]);

  const generateRulerGeometry = useMemo(() => {
    const planeGeometry = new PlaneGeometry(sizeX, sizeY, 1, 1);
		const planeMaterial = new ShaderMaterial({
			uniforms: {
					chunkSize: { value: gridConfig.chunkSize },
					offset: { value: new Vector2(0, 0) },
					subGridsX: { value: width }, // Adjusted to handle X axis
					subGridsY: { value: depth }, // Adjusted to handle Y axis
					lineWidth: { value: gridConfig.lineWidth },
					gridColor: { value: new Color(gridConfig.subGridColor) },
					subGridColor: { value: new Color(gridConfig.subGridColor) },
					gridSize: { value: new Vector2(sizeX, sizeY) },
			},
			vertexShader,
			fragmentShader,
			transparent: true,
			side: DoubleSide,
			depthWrite: false,
	});

    return () => {
      if (rulerRef.current) {
        rulerRef.current.geometry = planeGeometry;
        rulerRef.current.material = planeMaterial;
      }
    };
  }, [sizeX, sizeY, gridConfig.chunkSize, gridConfig.lineWidth, gridConfig.subGridColor, width, depth]);

  return (
    <mesh position={position} ref={rulerRef} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry />
      <shaderMaterial />
    </mesh>
  );
};
