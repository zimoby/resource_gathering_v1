import { shaderMaterial } from "@react-three/drei";
import { Object3DNode, extend, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Color, DoubleSide, Mesh, PlaneGeometry, ShaderMaterial } from "three";

interface PulsingShaderMaterialUniforms {
  uTime: number;
  uColor: Color;
  uFrequency: number;
  uAmplitude: number;
  uOpacity: number;
}

const PulsingShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new Color(0x0000ff),
    uFrequency: 10,
    uAmplitude: 0.5,
    uOpacity: 0.5,
    transparent: true,
    side: DoubleSide,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uFrequency;
    uniform float uAmplitude;
    uniform float uOpacity;
    varying vec2 vUv;
    void main() {
      float value = sin(uTime * uFrequency) * uAmplitude + 0.5;
      gl_FragColor = vec4(uColor, value * uOpacity);
    }
  `
);

// Extend drei's shaders with our custom shader
extend({ PulsingShaderMaterial });

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      pulsingShaderMaterial: Object3DNode<ShaderMaterial, typeof PulsingShaderMaterial> & PulsingShaderMaterialUniforms;
    }
  }
}

type PulsingShaderMaterialImpl = ShaderMaterial & { uniforms: { [uniform: string]: { value: unknown } } };

export const PlaneTest = ({ position = [0,0,0], color = new Color(0x0000ff) }) => {
  const ref = useRef<Mesh<PlaneGeometry, PulsingShaderMaterialImpl>>(null);
  const size = 100;

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (ref.current) {
      ref.current.material.uniforms.uTime.value = time;
    }
  });

  return (
    <group position={position}>
      <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size, size, 32, 32]} />
        <pulsingShaderMaterial
          uTime={0}
          uColor={color}
          uFrequency={5}
          uAmplitude={0.1}
          uOpacity={0.01}
        />
      </mesh>
    </group>
  );
};
