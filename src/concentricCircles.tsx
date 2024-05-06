import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, Color } from "three";

export const ConcentricCirclesAnimation = () => {
  const ref = useRef();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    ref.current.uniforms.uTime.value = time;
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: 2 },
      uSize: { value: 20 },
      uColor: { value: new Color(0xffffff) },
			uEdgeSoftness: { value: 0.5 },
    }),
    []
  );

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[5, 64]} />
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

    // Adjusting the sine function for sharper transitions
    float wave = sin(dist * uSize - time) * 0.5 + 0.5;
    float sizeFactor = smoothstep(0.48 - 0.3, 0.52 - 0.3, wave);  // This sharpens the transition

    float alpha = sizeFactor; // Combine sharpened alpha with smooth edge transition

    gl_FragColor = vec4(uColor, alpha);
  }
`;

// const simplifiedFragmentShader = `
//   uniform float uTime;
//   uniform float uSpeed;
//   uniform float uSize;
// 	uniform vec3 uColor;
// 	uniform float uEdgeSoftness;

//   varying vec2 vUv;

//   void main() {
//     vec2 center = vec2(0.5, 0.5);
//     float dist = distance(vUv, center);
//     float time = uTime * uSpeed;
//     float sizeFactor = sin(dist * uSize - time) * 0.5 + 0.5;
//     sizeFactor *= smoothstep(1.0 - uEdgeSoftness, 0.0, dist);

//     float alpha = sizeFactor; // Use sizeFactor directly for alpha

//     gl_FragColor = vec4(uColor, alpha);
//   }
// `;
