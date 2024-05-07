import { useRef, useEffect, useState, useMemo } from "react";
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

const updateBeacons = (deltaX: number, deltaY: number, beacons, params) => {
  // console.log("updateBeacons", deltaX, deltaY, beacons, params);

  const beaconDeepCopy = JSON.parse(JSON.stringify(beacons));

  beaconDeepCopy.forEach(beacon => {
    beacon.x -= deltaX;
    beacon.z -= deltaY;
    beacon.visible = !isOutOfBound({x: beacon.x, y: beacon.y, z: beacon.z}, params.width, params.depth, params.offsetX, params.offsetY);
  });

  return beaconDeepCopy;
};


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

export const Terrain = () => {
  const firstStart = useGamaStore((state) => state.firstStart);
  const loading = useGamaStore((state) => state.loading);
  const { width, depth, resolution, scale, seed, offsetX, offsetY, speed } = useGamaStore((state) => state.mapParams);
  const gridConfig = useGamaStore((state) => state.gridConfig);
  const canPlaceBeacon = useGamaStore((state) => state.canPlaceBeacon);
  const beacons = useGamaStore((state) => state.beacons);
  const scanRadius = useGamaStore((state) => state.scanRadius);
  const activePosition = useGamaStore((state) => state.activePosition);
  const direction = useGamaStore((state) => state.moveDirection);

  // useEffect(() => {
  //   console.log("offsetX", offsetX);
  // }, [offsetX]);

  const widthCount = Math.floor(width / resolution);
  const depthCount = Math.floor(depth / resolution) + 1;

  const { camera } = useThree();

  const planeRef = useRef();
  const meshRef = useRef();
  const terrainGeometry = useRef(new BufferGeometry());
  const offset = useRef({ x: 0, y: 0 });
  const customSpeed = useRef(1);

  const colors = useRef(new Float32Array((widthCount + 1) * (depthCount + 1) * 3));
  const positions = useRef(new Float32Array((widthCount + 1) * (depthCount + 1) * 3));
  const resources = useRef(new Array((widthCount + 1) * (depthCount + 1)).fill(null));

  const indices = useMemo(() => {
    const indicesPrecalc = new Uint16Array(widthCount * depthCount * 6);
    generateIndices(widthCount, depthCount, indicesPrecalc);
    return indicesPrecalc;
  }, [width, depth, resolution]);

  const colorAttribute = useRef(new Float32BufferAttribute(colors.current, 3));
  const indexAttribute = useRef(new BufferAttribute(indices, 1));
  const noise2D = useMemo(() => createNoise2D(seedrandom(seed)), [seed])


  const raycaster = new Raycaster();

  useKeyboardControls({ customSpeed, raycaster, meshRef, camera });

  useCanvasHover({ camera, raycaster, meshRef, resources });


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

  const generateGridGeometry = () => {
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

    planeRef.current.geometry = planeGeometry;
    planeRef.current.material = planeMaterial;
  };

  // const updateLevaWidthAndDepth = (width: number, depth: number) => {
  //   levaStore.set({ width, depth });
  // };
  const deltaX = direction.x * (speed * customSpeed.current);
  const deltaY = direction.y * (speed * customSpeed.current);


  useFrame(() => {
    // if (canPlaceBeacon) {
    //   // easing.damp3(model.current.position, [0, 0, 0], 0.2, delta)
    //   // easing.damp3(state.camera.position, [-state.pointer.x * 4, 2.5 + -state.pointer.y * 4, 12], 0.3, delta)

    //   // make animation of increasing scan area from 0 to scanRadius
    //   // dynamicScanArea.current = easing.damp(dynamicScanArea.current, scanRadius, 0.2);

    //   dynamicScanArea.current = 
    //   console.log("dynamicScanArea:", dynamicScanArea.current);
  
    // }

    offset.current.x += deltaX;
    offset.current.y += deltaY;

    // console.log("global position:", getChunkCoordinates(offset.current.x + offsetX + 100, offset.current.y + offsetY + 100, width).chunkY);
    const currentChunk = getChunkCoordinates(
      offset.current.x + offsetX + width / 2,
      offset.current.y + offsetY + depth / 2,
      width
    );

    const resources = updateTerrainGeometry();
    
    if (resources[0] !== null && loading) {
      useGamaStore.setState({ loading: false });
    }
    
    const updatedBeacons = updateBeacons(deltaX, deltaY, beacons, { width, depth, offsetX, offsetY });
    
    if (deltaX !== 0 || deltaY !== 0) {

      useGamaStore.setState({
        currentLocation: { x: currentChunk.x, y: currentChunk.y },
        currentOffset: { x: offset.current.x, y: offset.current.y },
        beacons: updatedBeacons,
      });

      planeRef.current.material.uniforms.offset.value.set(offset.current.x * 0.01, -offset.current.y * 0.01);
    }

  });

  return (
    <group visible={firstStart}>
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
