import { useMemo, useRef } from "react";
import { ShaderMaterial, DoubleSide, Color, PlaneGeometry, Mesh, Vector3, Euler } from "three";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../../store/store";

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float width;
  uniform float depth;
  uniform vec3 color;
  uniform float opacity;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv - 0.5;
    uv.x *= width / depth;
    float dist = max(abs(uv.x), abs(uv.y));
    float ring = smoothstep(0.48, 0.49, dist) - smoothstep(0.49, 0.5, dist);
    gl_FragColor = vec4(color, opacity * ring);
  }
`;

export const RingPlaneShader = ({
  color,
  opacity,
  position,
  rotation,
}: {
  color: string;
  opacity: number;
  position: Vector3;
  rotation: Euler;
}) => {
  const { width, depth } = useGameStore((state) => state.mapParams);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          width: { value: width },
          depth: { value: depth },
          color: { value: new Color(color) },
          opacity: { value: opacity },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        side: DoubleSide,
        depthWrite: false,
      }),
    [width, depth, color, opacity]
  );

  const planeRef = useRef<Mesh<PlaneGeometry, ShaderMaterial>>(null);

  useFrame(() => {
    if (planeRef.current) {
      planeRef.current.material = material;
      planeRef.current.material.uniforms.width.value = width;
      planeRef.current.material.uniforms.depth.value = depth;
      planeRef.current.material.uniforms.color.value = new Color(color);
      planeRef.current.material.uniforms.opacity.value = opacity;
    }
  });

  return (
    <mesh ref={planeRef} position={position} rotation={rotation}>
      <planeGeometry args={[width + 14, depth + 14]} />
      <shaderMaterial />
    </mesh>
  );
};
