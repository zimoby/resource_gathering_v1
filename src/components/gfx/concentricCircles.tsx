import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, Color, ShaderMaterial } from "three";

export const ConcentricCirclesAnimation = ({ size = 5 }) => {
  const ref = useRef<ShaderMaterial | null>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (ref.current) {
      ref.current.uniforms.uTime.value = time;
    }
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: 2 },
      uSize: { value: 20 },
      uColor: { value: new Color(0xf4f4f4) },
      uEdgeSoftness: { value: 0.5 },
    }),
    []
  );

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[size, 64]} />
      <shaderMaterial
        ref={ref}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={simplifiedFragmentShader}
        transparent
        side={DoubleSide}
      />
    </mesh>
  );
};

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const simplifiedFragmentShader = `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uSize;
	uniform vec3 uColor;
	uniform float uEdgeSoftness;

  varying vec2 vUv;

  void main() {
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(vUv, center);
    float time = uTime * uSpeed;

    float wave = sin(dist * uSize - time) * 0.5 + 0.5;
    float sizeFactor = smoothstep(0.48 - 0.3, 0.52 - 0.3, wave); 

    float alpha = sizeFactor;

    gl_FragColor = vec4(uColor, alpha);
  }
`;
