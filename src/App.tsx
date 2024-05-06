import { useRef, useEffect, useState, useCallback, Key, act, useMemo } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import {
  DoubleSide,
  BufferGeometry,
  Float32BufferAttribute,
  NormalBufferAttributes,
  Color,
  Raycaster,
  Vector2,
  PlaneGeometry,
  ShaderMaterial,
  AdditiveBlending,
} from "three";
import { createNoise2D } from "simplex-noise";
import seedrandom from "seedrandom";
import { Cylinder, OrbitControls, OrthographicCamera, Sphere, Stats, Text, shaderMaterial } from "@react-three/drei";
import { useControls } from "leva";
import useStore, { minLevel, resourceTypes, terrainTypes } from "./store";

import { vertexShader, fragmentShader } from './chunkGridShader';
import { ConcentricCirclesAnimation } from "./concentricCircles";
import { EffectsCollection } from "./effects";

import { debounce } from 'lodash';


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

// const convertChunkCoordinateToName = (chunk: { x: any; y: any }) => {
//   return `CH${chunk.x}${chunk.y}`;
// }

const convertChunkCoordinateToName = (chunk) => {
  const ns = chunk.y >= 0 ? 'N' : 'S';
  const ew = chunk.x >= 0 ? 'E' : 'W';
  const absX = Math.abs(chunk.x);
  const absY = Math.abs(chunk.y);
  return `CH-${ew}${absX}${ns}${absY}`;
}

const PulsingCircle = () => {
  const activePosition = useStore((state) => state.activePosition);
  const canPlaceBeacon = useStore((state) => state.canPlaceBeacon);
  const ref = useRef();
  const size = 10;

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    // console.log("ref.current:", ref.current);
    if (ref.current) {
      ref.current.material.uniforms.uTime.value = time;
    }
  });

  return (
    <group visible={canPlaceBeacon} position={[activePosition.x, activePosition.y, activePosition.z]}>
      <ConcentricCirclesAnimation />
      {/* <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[size, 32]} />
        <pulsingShaderMaterial
          ref={ref}
          uTime={0}
          uColor={new Color(0xffffff)}
          uFrequency={10}
          uAmplitude={0.5}
          uOpacity={0.5}
        />
      </mesh> */}
    </group>
  );
};

const PlaneTest = () => {

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

const getChunkCoordinates = (globalX: number, globalY: number, chunkSize: number) => {
  const chunkX = Math.floor(globalX / chunkSize);
  const chunkY = Math.floor(globalY / chunkSize);
  return { chunkX, chunkY };
};

const useKeyboardControls = ({
  direction,
  customSpeed,
}: {
  direction: {
    current: { x: number; y: number };
    x: number;
    y: number;
  };
  customSpeed: {
    current: number;
  };
}): void => {
  useEffect(() => {
    const handleKeyDown = (event: { key: any }) => {
      switch (event.key) {
        case "ArrowUp":
        case "w":
          direction.current = { x: 0, y: -1 };
          break;
        case "ArrowDown":
        case "s":
          direction.current = { x: 0, y: 1 };
          break;
        case "ArrowLeft":
        case "a":
          direction.current = { x: -1, y: 0 };
          break;
        case "ArrowRight":
        case "d":
          direction.current = { x: 1, y: 0 };
          break;
        case "Shift":
          customSpeed.current = 3;
          break;
        case " ":
          useStore.setState({ canPlaceBeacon: true });
          break;
      }
    };

    const handleKeyUp = (event: { key: any }) => {
      switch (event.key) {
        case "Shift":
          customSpeed.current = 1;
          break;
        case " ":
          useStore.setState({ canPlaceBeacon: false });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // return { canPlaceBeacon, setCanPlaceBeacon };
};

const useCanvasHover = ({ camera, raycaster, meshRef, resources }) => {
  const canPlaceBeacon = useStore((state) => state.canPlaceBeacon);
  // use hover only when placing beacon

  const { width, depth, offsetX, offsetY } = useControls({
    width: { value: 100, min: 50, max: 200 },
    depth: { value: 100, min: 50, max: 200 },
    offsetX: { value: 0, min: -100, max: 100 },
    offsetY: { value: 0, min: -100, max: 100 },
  });

  // const debounceUpdateActivePosition = useCallback(
  //   debounce((position) => {
  //     useStore.setState({ activePosition: position });
  //   }, 10),
  //   []
  // );

  useEffect(() => {
    const handleCanvasHover = (event: { clientX: number; clientY: number }) => {
      if (!canPlaceBeacon) {
        // setScanningArea(null);
        useStore.setState({ showResources: false });
        return;
      }

      const mouse = new Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(meshRef.current);

      if (intersects.length > 0) {
        const vertexIndex = intersects[0].face.a;
        const resource = resources.current[vertexIndex];
        useStore.setState({ selectedResource: resource, activePosition: intersects[0].point, showResources: true});

        // debounceUpdateActivePosition(intersects[0].point);
        // debounce(() => {
        //   useStore.setState({ activePosition: intersects[0].point, showResources: true });
        // }, 100)();

      }
    };

    const handleCanvasClick = (event: { clientX: number; clientY: number }) => {
      if (!canPlaceBeacon) return;

      const mouse = new Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(meshRef.current);

      if (intersects.length > 0) {
        // useStore.setState({ activePosition: intersects[0].point });

        handleObjectClick(
          {
            point: intersects[0].point,
            face: intersects[0].face,
            resources,
          },
          offsetX,
          offsetY
        );
      }
    };

    window.addEventListener("click", handleCanvasClick);
    window.addEventListener("mousemove", handleCanvasHover);
    return () => {
      window.removeEventListener("click", handleCanvasClick);
      window.removeEventListener("mousemove", handleCanvasHover);
    };
  }, [camera, meshRef, canPlaceBeacon, resources, offsetX, offsetY]);
};

const addBeacon = (
  position: { x: number; z: number; y: number },
  resource: any,
  offsetX: number,
  offsetY: number
) => {
  const currentChunk = useStore.getState().currentLocation;
  const beacons = useStore.getState().beacons;
  const chunkBeacons = beacons.filter(
    (beacon: { chunk: { x: any; y: any } }) =>
      beacon.chunk.x === currentChunk.x && beacon.chunk.y === currentChunk.y
  );

  const minDistance = 10;

  const isWithinRadius = chunkBeacons.some((beacon: { position: { x: number; z: number } }) => {
    const dx = position.x - offsetX - beacon.position.x;
    const dz = position.z - offsetY - beacon.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    return distance < minDistance;
  });

  if (isWithinRadius) {
    useStore.setState({ message: "Cannot place beacon too close to another beacon." });
    return;
  }

  // console.log("Beacons in chunk:", [beacon.chunk.x, beacon.chunk.y, currentChunk.x, currentChunk.y]);

  if (chunkBeacons.length >= 2) {
    useStore.setState({ message: "Maximum beacons placed in this chunk." });
    // console.log("Maximum beacons placed in this chunk.");
    return;
  }

  useStore.setState((state: { beacons: any }) => {
    const newBeacons = [
      ...state.beacons,
      {
        position: {
          x: position.x.toFixed(3) - offsetX,
          y: position.y.toFixed(3),
          z: position.z.toFixed(3) - offsetY,
        },
        resource,
        chunk: currentChunk,
        visible: true,
      },
    ];
    return { beacons: newBeacons };
  });
};

const handleObjectClick = ({ point, face, resources }: any, offsetX: any, offsetY: any) => {
  if (face) {
    const vertexIndex = face.a;
    const selectedResource = resources.current[vertexIndex];
    useStore.setState({ selectedResource: selectedResource });

    addBeacon(point, selectedResource, offsetX, offsetY);
  }
};

const checkResource = (height: number) => {
  for (const [type, { level }] of Object.entries(terrainTypes)) {
    if (height < level) {
      return type;
    }
  }
  return "default";
};

const getResourceColor = (resourceType: string | number) => {
  return resourceTypes[resourceType]?.color || new Color(0xffffff);
};

const applyTerrainColors = (
  positions: any[] | Float32Array,
  colors: any[] | Float32Array,
  widthCount: number,
  depthCount: number,
  scale: number
) => {
  for (let i = 0; i <= depthCount; i++) {
    for (let j = 0; j <= widthCount; j++) {
      const idx = (i * (widthCount + 1) + j) * 3;
      const height = positions[idx + 1];

      const resource = checkResource(height);
      const color = terrainTypes[resource].color;

      colors[idx] = color.r;
      colors[idx + 1] = color.g;
      colors[idx + 2] = color.b;
    }
  }
};

const applyResources = ({ resources, widthCount, depthCount, scale, offsetX, offsetY, rng }) => {
  const noise2D = createNoise2D(rng);
  const resourceScale = scale * 0.021;
  const speedFactor = resourceScale / 100;

  for (let i = 0; i <= depthCount; i++) {
    for (let j = 0; j <= widthCount; j++) {
      const x = (j / widthCount) * resourceScale + offsetX * speedFactor;
      const y = (i / depthCount) * resourceScale + offsetY * speedFactor;
      const noiseValue = (noise2D(x, y) + 1) / 2;

      for (const [type, { threshold }] of Object.entries(resourceTypes)) {
        if (noiseValue < threshold) {
          resources[i * (widthCount + 1) + j] = type;
          break;
        }
      }
    }
  }

  // console.log("Resources:", resources[0]);
};

const generateTerrain = (
  width: number,
  depth: number,
  resolution: number,
  scale: number,
  seed: string | undefined,
  offsetX: number,
  offsetY: number,
  geometry: BufferGeometry<NormalBufferAttributes>,
  showResources: boolean,
  activePosition,
  scanRadius = 0
) => {
  const rng = seedrandom(seed);
  const noise2D = createNoise2D(rng);
  const widthCount = Math.floor(width / resolution);
  const depthCount = Math.floor(depth / resolution) + 1;
  const positions = new Float32Array((widthCount + 1) * (depthCount + 1) * 3);
  const indices = [];
  const heightMultiplier = 20;
  const baseLineOffset = -5;

  const generateHeight = (x, y, scale, offsetX, offsetY) => {
    const scaleCorrection = scale * 5;
    const largeScale = noise2D((x + offsetX) / scaleCorrection, (y + offsetY) / scaleCorrection) * 0.5; // Broad features
    const mediumScale = noise2D((x + offsetX) / (scaleCorrection * 0.5), (y + offsetY) / (scaleCorrection * 0.5)) * 0.25; // Mid-level features
    const smallScale = noise2D((x + offsetX) / (scaleCorrection * 0.25), (y + offsetY) / (scaleCorrection * 0.25)) * 0.25; // Detailed features
    // return Math.pow(largeScale, 1);
    const combined = largeScale + mediumScale + smallScale;

    if (combined >= 0) {
      return Math.pow(combined, 3/4);
    } else {
      return combined;
    }
  };
  
  for (let i = 0; i <= depthCount; i++) {
    for (let j = 0; j <= widthCount; j++) {
      const x = j * resolution - width / 2;
      const heightNoise = generateHeight(x, i * resolution, scale, offsetX, offsetY);
      // console.log("heightNoise:", heightNoise);
      const y = Math.max(heightNoise * heightMultiplier + baseLineOffset, minLevel);
      // const y = Math.max(heightNoise * (heightMultiplier + heightMultiplier / 2) - heightMultiplier / 2, -heightMultiplier);

      const z = i * resolution - depth / 2;
      const idx = (i * (widthCount + 1) + j) * 3;
      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;

      if (i < depthCount && j < widthCount) {
        const a = i * (widthCount + 1) + j;
        const b = a + widthCount + 1;
        indices.push(a, b, a + 1);
        indices.push(b, b + 1, a + 1);
      }
    }
  }

  geometry.dispose();

  const colors = new Float32Array((widthCount + 1) * (depthCount + 1) * 3);
  applyTerrainColors(positions, colors, widthCount, depthCount, scale);

  const resources = new Array((widthCount + 1) * (depthCount + 1)).fill(null);
  applyResources({ resources, widthCount, depthCount, scale, offsetX, offsetY, rng });

  // if (showResources) {
  //   for (let i = 0; i < resources.length; i++) {
  //     const resource = resources[i];
  //     if (resource) {
  //       const color = getResourceColor(resource);
  //       colors[i * 3] = color.r;
  //       colors[i * 3 + 1] = color.g;
  //       colors[i * 3 + 2] = color.b;
  //     }
  //   }
  // }

  // const alwayShowResources = true;  

  if (showResources) {
    const mousePosX = activePosition.x + width / 2;
    const mousePosZ = activePosition.z + depth / 2;
    for (let i = 0; i <= depthCount; i++) {
      const posZ = (i / depthCount) * depth - mousePosZ;
      for (let j = 0; j <= widthCount; j++) {
        const posX = (j / widthCount) * width - mousePosX;
        const distance = Math.sqrt((posX) ** 2 + (posZ) ** 2);
        if (distance <= scanRadius) {
          const index = i * (widthCount + 1) + j;
          const resource = resources[index];
          if (resource) {
            const color = getResourceColor(resource);
            colors[index * 3] = color.r;
            colors[index * 3 + 1] = color.g;
            colors[index * 3 + 2] = color.b;
          }
        }
      }
    }
  }




  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
  // geometry.setAttribute("originalColor", new Float32BufferAttribute(originalColors, 3));
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return { colors, resources };
};

const isOutOfBound = (
  position: { x: any; y?: any; z: any },
  width: number,
  depth: number,
  offsetX: number,
  offsetY: number
) => {
  return (
    position.x < -width / 2 + offsetX ||
    position.x > width / 2 + offsetX ||
    position.z < -depth / 2 + offsetY ||
    position.z > depth / 2 + offsetY
  );
};

const Terrain = () => {
  const { width, depth, resolution, scale, seed, offsetX, offsetY } = useControls({
    width: { value: 100, min: 50, max: 200 },
    depth: { value: 100, min: 50, max: 200 },
    resolution: { value: 3, min: 3, max: 50 },
    scale: { value: 50, min: 10, max: 100 },
    seed: "42",
    offsetX: { value: 0, min: -100, max: 100 },
    offsetY: { value: 0, min: -100, max: 100 },
  });

  const { speed } = useControls({
    speed: { value: 0.1, min: 0, max: 0.5 },
  });

  const gridConfig = useControls({
    chunkSize: { value: 1, min: 1, max: 200 },
    subGrids: { value: 5, min: 1, max: 20, step: 1 },
    lineWidth: { value: 0.2, min: 0.01, max: 0.5 },
    gridColor: '#ff0000',
    subGridColor: '#ffffff',
  });

  const { camera } = useThree();

  const showResources = useStore((state) => state.showResources);
  const beacons = useStore((state) => state.beacons);
  const scanRadius = useStore((state) => state.scanRadius);
  const activePosition = useStore((state) => state.activePosition);

  // const [scanningArea, setScanningArea] = useState(null);
  // const pulsingCirclePosition = useStore((state) => state.activePosition);
  // const canPlaceBeacon = useStore((state) => state.canPlaceBeacon);

  // const selectResource = useStore((state) => state.selectRecource);
  const planeRef = useRef();
  const meshRef = useRef();
  const terrainGeometry = useRef(new BufferGeometry());
  const offset = useRef({ x: 0, y: 0 });
  const direction = useRef({ x: 0, y: -1 });
  const customSpeed = useRef(1);
  // const [selectedResource, setSelectedResource] = useState(null);
  // const [resources, setResources] = useState([]);
  const resources = useRef([]);

  const raycaster = new Raycaster();

  useKeyboardControls({ direction, customSpeed });

  useKeyboardControls({
    direction,
    customSpeed,
  });

  useCanvasHover({ camera, raycaster, meshRef, resources });

  // useCanvasClick({
  //   camera,
  //   raycaster,
  //   handleObjectClick,
  //   meshRef,
  //   resources,
  //   offsetX,
  //   offsetY,
  // });

  useEffect(() => {
    const { resources: generatedResources } = generateTerrain(
      width,
      depth,
      resolution,
      scale,
      seed,
      offsetX,
      offsetY,
      terrainGeometry.current,
      showResources,
      activePosition,
      scanRadius
    );
    resources.current = generatedResources;
  }, [width, depth, resolution, scale, seed, offsetX, offsetY, showResources, activePosition]);

  useEffect(() => {
    generateGridGeometry();
  }, [width, depth, gridConfig]);

  const updateTerrainGeometry = () => {
    const { colors, resources: generatedResources } = generateTerrain(
      width,
      depth,
      resolution,
      scale,
      seed,
      offset.current.x + offsetX,
      offset.current.y + offsetY,
      terrainGeometry.current,
      showResources,
      activePosition,
      scanRadius
    );
    terrainGeometry.current.setAttribute("color", new Float32BufferAttribute(colors, 3));
    resources.current = generatedResources;

    if (meshRef.current) {
      meshRef.current.geometry = terrainGeometry.current;
    }
  };

  const updateBeacons = (deltaX: number, deltaY: number) => {
    const updatedBeacons = beacons
      .map((beacon: { position: { x: any; y: any; z: any }; visible: boolean }) => {
        const newPosition = {
          x: parseFloat((beacon.position.x - deltaX).toFixed(2)),
          y: beacon.position.y,
          z: parseFloat((beacon.position.z - deltaY).toFixed(2)),
        };

        // Check bounds here if necessary
        beacon.visible = !isOutOfBound(newPosition, width, depth, offsetX, offsetY);
        beacon.position = newPosition;

        return beacon;
      })
      .filter(Boolean);

    useStore.setState({ beacons: updatedBeacons });
  };

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

  useFrame(() => {
    const deltaX = direction.current.x * (speed * customSpeed.current);
    const deltaY = direction.current.y * (speed * customSpeed.current);

    // console.log("deltaX:", deltaX, deltaY);

    offset.current.x += deltaX;
    offset.current.y += deltaY;

    // console.log("global position:", getChunkCoordinates(offset.current.x + offsetX + 100, offset.current.y + offsetY + 100, width).chunkY);
    const currentChunk = getChunkCoordinates(
      offset.current.x + offsetX + width / 2,
      offset.current.y + offsetY + depth / 2,
      width
    );

    useStore.setState({ currentLocation: { x: currentChunk.chunkX, y: currentChunk.chunkY } });

    if (deltaX !== 0 || deltaY !== 0) {
      updateTerrainGeometry();
      updateBeacons(deltaX, deltaY);
      planeRef.current.material.uniforms.offset.value.set(offset.current.x * 0.01, -offset.current.y * 0.01);
    }

  });

  return (
    <>
      <mesh ref={meshRef} geometry={terrainGeometry.current}>
        <meshStandardMaterial wireframe={true} vertexColors side={DoubleSide} />
      </mesh>
      <mesh ref={planeRef} rotation={[-Math.PI / 2,0,0]}>
        <planeGeometry />
        <shaderMaterial />
      </mesh>
    </>
  );
};

const Beacons = () => {
  const beacons = useStore((state) => state.beacons);
  const { offsetX, offsetY, width, depth } = useControls({
    offsetX: { value: 0, min: -100, max: 100 },
    offsetY: { value: 0, min: -100, max: 100 },
    width: { value: 100, min: 50, max: 200 },
    depth: { value: 100, min: 50, max: 200 },
  });

  const beaconHeight = 10;

  return (
    <>
      {beacons.map(
        (
          beacon: { position: { x: any; y: any; z: any }; visible: any },
          index: string | number | bigint | undefined
        ) => {
          const position = {
            x: beacon.position.x,
            y: beacon.position.y,
            z: beacon.position.z,
          };

          const isVisible =
            beacon.visible && !isOutOfBound(position, width, depth, offsetX, offsetY);

          return (
            isVisible && (
              <group
                key={index}
                position={[position.x - offsetX, position.y, position.z - offsetY]}
              >
                <Sphere args={[1, 8, 8]} position={[0, beaconHeight, 0]} />
                <Cylinder args={[0.1, 0.1, beaconHeight, 4]} position={[0, beaconHeight / 2, 0]} />
                <ConcentricCirclesAnimation />
              </group>
            )
          );
        }
      )}
    </>
  );
};

const ChunkGrid = ({ position, sizeExtend = 0 }) => {
  const { width, depth } = useControls({
    width: { value: 100, min: 50, max: 200 },
    depth: { value: 100, min: 50, max: 200 },
  });

  const gridGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    const positions = [];
    const colors = [];

    const gridColor = new Color(0xffffff);

    positions.push(
      -(width + sizeExtend) / 2, 0, -(depth + sizeExtend) / 2,
      (width + sizeExtend) / 2, 0, -(depth + sizeExtend) / 2,
      (width + sizeExtend) / 2, 0, (depth + sizeExtend) / 2,
      -(width + sizeExtend) / 2, 0, (depth + sizeExtend) / 2
    );

    colors.push(
      gridColor.r, gridColor.g, gridColor.b,
      gridColor.r, gridColor.g, gridColor.b,
      gridColor.r, gridColor.g, gridColor.b,
      gridColor.r, gridColor.g, gridColor.b
    );

    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));

    geometry.setIndex([0, 1, 1, 2, 2, 3, 3, 0]);

    return geometry;
  }, [width, depth]);

  return (
    <lineSegments geometry={gridGeometry} position={position}>
      <lineBasicMaterial vertexColors />
    </lineSegments>
  );
};

const App = () => {
  const toggleShowResources = useStore((state) => state.toggleShowResources);
  const selectedResource = useStore((state) => state.selectedResource);
  const selectedChunk = useStore((state) => state.selectedChunk);
  const currentLocation = useStore((state) => state.currentLocation);
  const beacons = useStore((state) => state.beacons);
  const message = useStore((state) => state.message);

  const playerPoints = useStore((state) => state.playerPoints);
  const collectedResources = useStore((state) => state.collectedResources);

  useEffect(() => {
    const interval = setInterval(() => {
      useStore.setState((state) => {
        // Calculate the new player points
        const newPlayerPoints = state.playerPoints + state.beacons.reduce(
          (total, beacon) => total + resourceTypes[beacon.resource].score,
          0
        );
  
        // Calculate the new collected resources
        const newCollectedResources = { ...state.collectedResources };
        state.beacons.forEach((beacon) => {

          if (newCollectedResources.hasOwnProperty(beacon.resource)) {
            newCollectedResources[beacon.resource] += 1;
          } else {
            newCollectedResources[beacon.resource] = 1;
          }
        });
  
        return {
          playerPoints: newPlayerPoints,
          collectedResources: newCollectedResources
        };
      });
    }, 1000);
  
    return () => {
      clearInterval(interval);
    };
  }, []);
  

  const currentChunkName = useMemo(() => {
    return convertChunkCoordinateToName(currentLocation);
  }, [currentLocation]);

  return (
    <>
      <div className="scrollbar z-50 p-1 h-56 w-fit text-left m-2 text-xs fixed bottom-0 right-0 rounded-md border border-white/80">
        {beacons.map(
          (
            beacon: { chunk: { x: any; y: any }; resource: any; position: { x: any; z: any } },
            index: Key | null | undefined
          ) => (
            <div key={index}>
              {convertChunkCoordinateToName(beacon.chunk)}
              {/* {`CH${beacon.chunk.x}${beacon.chunk.y}: ${beacon.resource}: ${beacon.position.x}, ${beacon.position.z}`} */}
              {/* {beacon.position.x}, {beacon.position.z} */}
            </div>
          )
        )}
      </div>
      {/* <div className="fixed left-1/2"> */}
      <div className="z-50 fixed top-0 left-0">

        <button onClick={toggleShowResources}>Toggle Resource View</button>
      </div>
      {/* </div> */}
      <div className="z-50 flex fixed bottom-0 left-0 flex-col">
        <div>Selected Resource: {selectedResource}</div>
        <div>Current Location: {JSON.stringify(currentLocation)}</div>
        <div className=" text-lg ">Player Points: {playerPoints}</div>
        {Object.entries(collectedResources).map(([resource, count]) => (
          <div key={resource}>
            {resource}: {count}
            </div> 
        ))}
      </div>
      <div className="z-50 fixed bottom-0 left-1/2">{message}</div>
      <Stats />
      <Canvas flat shadows>
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.5} />
        <OrthographicCamera makeDefault position={[100, 75, 100]} zoom={7} />
        <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
        <Terrain />

        <Text
          position={[47, 0, 50]}
          rotation={[-Math.PI / 2,0,Math.PI / 2]}
          fontSize={18}
          fontWeight={"bold"}
          color={"#afafaf"}
          anchorX="left"
          anchorY="top"
        >
          {currentChunkName}
        </Text>

        <group position={[0, 0, 0]}>
          {/* <ChunkGrid position={[0,0,0]} /> */}
          <ChunkGrid position={[0,0,0]} />
          <ChunkGrid position={[0,-10,0]} sizeExtend={10} />
        </group>
        <Beacons />
        <PulsingCircle />
        {/* <ChunkGrid position={[0,-10,0]} /> */}
        {/* <PlaneTest /> */}
        {/* <ConcentricCirclesAnimation /> */}
        {/* <mesh position={[0,-12,0]} rotation-x={Math.PI / 2}>
          <planeGeometry args={[100,100]} />
          <meshBasicMaterial color={0x0000ff} side={DoubleSide} />
        </mesh> */}
        <OrbitControls />
        
        {/* <EffectsCollection /> */}

      </Canvas>
    </>
  );
};

export default App;
