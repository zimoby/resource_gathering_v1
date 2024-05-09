import { useRef, useEffect, useState, useMemo, createRef, useLayoutEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  DoubleSide,
  BufferGeometry,
  Float32BufferAttribute,
  Color,
  Raycaster,
  Vector2,
  PlaneGeometry,
  ShaderMaterial,
  BufferAttribute
} from "three";
import { levaStore, useControls } from "leva";
import useGamaStore from "../store";
import { getChunkCoordinates } from "../functions/functions";
import { useKeyboardControls } from "../intereaction";
import { useCanvasHover } from "../intereaction";
import { generateTerrain } from "../functions/generateTerrain";
import { isOutOfBound } from "../functions/functions";

import { vertexShader, fragmentShader } from './chunkGridShader';
import { easing } from "maath"
import { createNoise2D } from "simplex-noise";
import seedrandom from "seedrandom";
import { Cylinder, Sphere } from "@react-three/drei";
import { ConcentricCirclesAnimation } from "./concentricCircles";

// const updateBeacons = (deltaX: number, deltaY: number, beacons, params) => {
//   // console.log("updateBeacons", deltaX, deltaY, beacons, params);

//   const beaconDeepCopy = JSON.parse(JSON.stringify(beacons));

//   beaconDeepCopy.forEach(beacon => {
//     beacon.x -= deltaX;
//     beacon.z -= deltaY;
//     beacon.visible = !isOutOfBound({x: beacon.x, y: beacon.y, z: beacon.z}, params.width, params.depth, params.offsetX, params.offsetY);
//   });

//   // console.log("beaconDeepCopy:", beaconDeepCopy);

//   return beaconDeepCopy;
// };


const generateIndices = (widthCount, depthCount, indices) => {
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
  // console.log("indices precalculated:", indices, indices.length);
};

export const Map = () => {
  const firstStart = useGamaStore((state) => state.firstStart);
  const loading = useGamaStore((state) => state.loading);
  const { width, depth, resolution, scale, seed, offsetX, offsetY, speed } = useGamaStore((state) => state.mapParams);
  const gridConfig = useGamaStore((state) => state.gridConfig);
  const canPlaceBeacon = useGamaStore((state) => state.canPlaceBeacon);
  const scanRadius = useGamaStore((state) => state.scanRadius);
  const activePosition = useGamaStore((state) => state.activePosition);
  const direction = useGamaStore((state) => state.moveDirection);
  
  const mapParams = useGamaStore((state) => state.mapParams);
  const beacons = useGamaStore((state) => state.beacons);
  const beaconRefs = useRef(beacons.map(() => createRef()));
  const beaconHeight = 10;

  useLayoutEffect(() => {
    beaconRefs.current = beaconRefs.current.slice(0, beacons.length);
    for (let i = beaconRefs.current.length; i < beacons.length; i++) {
        beaconRefs.current[i] = createRef();
    }
    console.log("beaconRefs:", beaconRefs.current);
}, [beacons.length]);

  // useEffect(() => {
  //   console.log("beacons", beacons);
  // }, [beacons]);

  const widthCount = Math.floor(width / resolution);
  const depthCount = Math.floor(depth / resolution) + 1;

  const { camera } = useThree();

  const planeRef = useRef();
  const meshRef = useRef();
  const offset = useRef({ x: 0, y: 0 });
  const customSpeed = useRef(1);
  

  const colors = useRef(new Float32Array((widthCount + 1) * (depthCount + 1) * 3));
  const positions = useRef(new Float32Array((widthCount + 1) * (depthCount + 1) * 3));
  const resources = useRef(new Array((widthCount + 1) * (depthCount + 1)).fill(null));

  const indices = useMemo(() => {
    const indicesPrecalc = new Uint16Array(widthCount * depthCount * 6);
    generateIndices(widthCount, depthCount, indicesPrecalc);
    // console.log("indices precalculated:", indicesPrecalc, indicesPrecalc.length);
    return indicesPrecalc;
  }, [width, depth, resolution]);

  const noise2D = useMemo(() => createNoise2D(seedrandom(seed)), [seed])
  
  const raycaster = useRef(new Raycaster());
  const terrainGeometry = useRef(new BufferGeometry());
  const colorAttribute = useRef(new Float32BufferAttribute(colors.current, 3));
  const indexAttribute = useRef(new BufferAttribute(indices, 1));

  useKeyboardControls({ customSpeed, raycaster: raycaster.current, meshRef, camera });
  useCanvasHover({ camera, raycaster: raycaster.current, meshRef, resources });

  const updateTerrainGeometry = () => {
    const { colors: generatedColors, resources: generatedResources } = generateTerrain(
      width,
      depth,
      resolution,
      scale,
      noise2D,
      offset.current.x + offsetX,
      offset.current.y + offsetY,
      terrainGeometry.current,
      canPlaceBeacon,
      activePosition,
      scanRadius,
      resources.current,
      colors.current,
      positions.current,
      // indices,
      widthCount,
      depthCount,
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

  useEffect(() => {
    generateGridGeometry();
  }, [width, depth, gridConfig]);

  const generateGridGeometry = useMemo(() => {
    const planeGeometry = new PlaneGeometry(width, depth, 1, 1);
    const planeMaterial = new ShaderMaterial({
      uniforms: {
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
      planeRef.current.geometry = planeGeometry;
      planeRef.current.material = planeMaterial;
    };
  }, [width, depth, gridConfig]);


  // const updateLevaWidthAndDepth = (width: number, depth: number) => {
  //   levaStore.set({ width, depth });
  // };
  
  // const counter = useRef(0);
  
  // console.log("counter:", counter.current);
  const deltaX = direction.x * (speed * customSpeed.current);
  const deltaY = direction.y * (speed * customSpeed.current);
  
  useFrame(( { clock }) => {

    offset.current.x += deltaX;
    offset.current.y += deltaY;

    beaconRefs.current.forEach((beacon, index) => {
      const beaconObject = beacon.current; // Assuming each beacon is a child of the meshRef group
      if (beaconObject) {

        beaconObject.position.x -= deltaX;
        beaconObject.position.z -= deltaY;

        const visibilityBoundaries = !isOutOfBound({x: beaconObject.position.x, y: beaconObject.position.z}, width, depth, offsetX, offsetY);
        beaconObject.visible = visibilityBoundaries;
      }
    });

    const currentChunk = getChunkCoordinates(
      offset.current.x + offsetX + width / 2,
      offset.current.y + offsetY + depth / 2,
      width
    );

    const resources = updateTerrainGeometry();
    
    if (resources[0] !== null && loading) {
      // console.log("Loading complete");
      useGamaStore.setState({ loading: false });
    }
    
    // const updatedBeacons = updateBeacons(deltaX, deltaY, beacons, { width, depth, offsetX, offsetY });
    
    // if (deltaX !== 0 || deltaY !== 0) {
      // console.log("currentChunk:", currentChunk);
      // counter.current++;
      // console.log("currentChunk:", currentChunk);
      useGamaStore.setState({
        currentLocation: { x: currentChunk.x, y: currentChunk.y },
        currentOffset: { x: offset.current.x, y: offset.current.y },
        // beacons: updatedBeacons,
      });

      planeRef.current.material.uniforms.offset.value.set(offset.current.x * 0.01, -offset.current.y * 0.01);

  });

  return (
    <group visible={firstStart}>
      {beacons.map((beacon, index) => (
        <group key={index} >
          <group position={[beacon.x, beacon.y, beacon.z]} ref={beaconRefs.current[index]}>
            <Sphere args={[1, 8, 8]} position={[0, 10, 0]} />
            <Cylinder args={[0.1, 0.1, 10, 4]} position={[0, 5, 0]} />
            <ConcentricCirclesAnimation />
          </group>
        </group>
      ))}
      <mesh ref={meshRef} geometry={terrainGeometry.current}>
        <meshStandardMaterial wireframe={true} vertexColors side={DoubleSide} />
      </mesh>
      <mesh ref={planeRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry />
        <shaderMaterial />
      </mesh>
    </group>
  );
};
