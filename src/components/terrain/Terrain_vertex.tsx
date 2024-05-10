import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh, PlaneGeometry, ShaderMaterial } from 'three';
import { useGameStore } from "../../store";
import { extend } from 'lodash';

const terrainVertexShader = `
  uniform float width;
  uniform float depth;
  uniform float resolution;
  uniform float scale;
  uniform float offsetX;
  uniform float offsetY;
  uniform float heightMultiplier;
  uniform float baseLineOffset;

  // Hash function
  float hash(float n) { 
    return fract(sin(n) * 1e4); 
  }

  float noise(vec2 x) {
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0;
    float res = mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                    mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y);
    return res;
  }

  float generateHeight(float x, float y, float scale, float offsetX, float offsetY) {
    float noiseValue = noise(vec2(x, y) * scale + vec2(offsetX, offsetY));
    return noiseValue * heightMultiplier + baseLineOffset;
  }
  
  void main() {
    float x = position.x;
    float y = position.z;
    
    float heightNoise = generateHeight(x, y, scale, offsetX, offsetY);
    float height = max(heightNoise, 0.0);
    
    vec3 pos = vec3(x, height, y);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const terrainFragmentShader = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`;

extend({ PlaneGeometry });

const terrainMaterial = new ShaderMaterial({
    uniforms: {
      width: { value: 0 },
      depth: { value: 0 },
      resolution: { value: 0 },
      scale: { value: 0 },
      offsetX: { value: 0 },
      offsetY: { value: 0 },
      heightMultiplier: { value: 20 },
      baseLineOffset: { value: -5 },
    },
    vertexShader: terrainVertexShader,
    fragmentShader: terrainFragmentShader,
  });
  
  export const TerrainVertex = () => {
    const { width, depth, resolution, scale, offsetX, offsetY } = useGameStore((state) => state.mapParams);
    
    const widthSegments = Math.floor(width * resolution);
    const depthSegments = Math.floor(depth * resolution);
  
    const meshRef = useRef<Mesh>(null);
    const materialRef = useRef<ShaderMaterial>(null);
    
    useFrame(() => {
        if (materialRef.current) {
            materialRef.current.uniforms.width.value = width;
            materialRef.current.uniforms.depth.value = depth;
            materialRef.current.uniforms.resolution.value = resolution;
            materialRef.current.uniforms.scale.value = scale;
            materialRef.current.uniforms.offsetX.value = offsetX;
            materialRef.current.uniforms.offsetY.value = offsetY;
        }
    });
    
    return (
      <mesh ref={meshRef}>
        <planeGeometry args={[width, depth, widthSegments, depthSegments]} />
        <primitive object={terrainMaterial} attach="material" ref={materialRef} />
      </mesh>
    );
  };
  