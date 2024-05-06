import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Color, DoubleSide } from "three";

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
    `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    `
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uFrequency;
      uniform float uAmplitude;
      uniform float uOpacity;
      varying vec2 vUv;
      void main() {
        float value = sin(uTime * uFrequency) * uAmplitude + 0.5;
        // alpha
        gl_FragColor = vec4(uColor, value * uOpacity);
      }
    `,
  );
  
  extend({ PulsingShaderMaterial });
  

export const PlaneTest = () => {

    const ref = useRef();
    const size = 100;
  
    useFrame(({ clock }) => {
      const time = clock.getElapsedTime();
      if (ref.current) {
        ref.current.material.uniforms.uTime.value = time;
        // console.log("uTime value:", ref.current.material.uniforms.uTime.value);
      }
    });
  
    return (
      <group position={[0,5,0]}>
        <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[size, size, 32, 32]} />
          <pulsingShaderMaterial
            ref={ref}
            uTime={0}
            uColor={new Color(0x0000ff)}
            uFrequency={10}
            uAmplitude={0.5}
            uOpacity={0.5}
          />
          {/* <shaderMaterial
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={{
              uTime: { value: 0 }
            }}
            transparent={true}
            side={DoubleSide}
          /> */}
        </mesh>
      </group>
    );
  };