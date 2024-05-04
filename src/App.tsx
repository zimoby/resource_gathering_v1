import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  DoubleSide,
  BufferGeometry,
  Float32BufferAttribute,
  NormalBufferAttributes,
  Color,
  Raycaster,
  Vector2,
} from "three";
import { createNoise2D } from "simplex-noise";
import seedrandom from "seedrandom";
import { OrbitControls, Stats } from "@react-three/drei";
import { useControls } from "leva";
import useStore from "./store";

const terrainTypes = {
  water: {
    color: new Color(0x0000ff), // blue
    level: -9,
  },
  grass: {
    color: new Color(0x008000), // green
    level: 0,
  },
  dirt: {
    color: new Color(0xa52a2a), // brown
    level: 5,
  },
  snow: {
    color: new Color(0xffffff), // white
    level: 10,
  },
  default: {
    color: new Color(0x8b4513), // brown
  },
};

const resourceTypes = {
  r1: {
    color: new Color(0xffffff), // white
  },
  r2: {
    color: new Color(0xffa500), // orange
  },
  r3: {
    color: new Color(0x800080), // purple
  },
  r4: {
    color: new Color(0xff4080), // pink
  },
};

const useKeyboardControls = ({direction, customSpeed}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
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
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === "Shift") {
        customSpeed.current = 1;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
};

const useCanvasClick = (camera, raycaster, onObjectClick, meshRef) => {
  useEffect(() => {
    const handleCanvasClick = (event) => {
      const mouse = new Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(meshRef.current);

      if (intersects.length > 0) {
        onObjectClick(intersects[0]);
      }
    };

    window.addEventListener("click", handleCanvasClick);
    return () => {
      window.removeEventListener("click", handleCanvasClick);
    };
  }, [camera, raycaster, onObjectClick, meshRef]);
};

const checkResource = (height) => {
  for (const [type, { level }] of Object.entries(terrainTypes)) {
    if (height < level) {
      return type;
    }
  }
  return "default";
};

const getResourceColor = (resourceType) => {
  return resourceTypes[resourceType]?.color || new Color(0xffffff);
};

const applyTerrainColors = (positions, colors, widthCount, depthCount, scale) => {
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
  const resourceScale = scale * 0.021 ;
  const speedFactor = resourceScale / 100;
  
  const resourceTypes = ['r1', 'r2', 'r3', 'r4'];
  const thresholds = [0.1, 0.5, 0.8, 1];

  for (let i = 0; i <= depthCount; i++) {
    for (let j = 0; j <= widthCount; j++) {
      const x = (j / widthCount) * resourceScale + offsetX * speedFactor;
      const y = (i / depthCount) * resourceScale + offsetY * speedFactor;
      const noiseValue = (noise2D(x, y) + 1) / 2;

      for (let k = 0; k < thresholds.length; k++) {
        if (noiseValue < thresholds[k]) {
          resources[i * (widthCount + 1) + j] = resourceTypes[k];
          break;
        }
      }
    }
  }
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
  showResources: boolean
) => {
  const rng = seedrandom(seed);
  const noise2D = createNoise2D(rng);
  const widthCount = Math.floor(width / resolution);
  const depthCount = Math.floor(depth / resolution) + 1;
  const positions = new Float32Array((widthCount + 1) * (depthCount + 1) * 3);
  const indices = [];

  for (let i = 0; i <= depthCount; i++) {
    for (let j = 0; j <= widthCount; j++) {
      const x = j * resolution - width / 2;
      const heightNoise = noise2D((x + offsetX) / scale, (i * resolution + offsetY) / scale);
      const heightCorrected = Math.pow(heightNoise, 1);
      const y = Math.max(heightCorrected * 15 - 5, -10);
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
  applyResources({resources, widthCount, depthCount, scale, offsetX, offsetY, rng});

  if (showResources) {
    for (let i = 0; i < resources.length; i++) {
      const resource = resources[i];
      if (resource) {
        const color = getResourceColor(resource);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
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
    speed: { value: 0.1, min: 0.01, max: 0.5 },
  });

  const { camera } = useThree();

  const showResources = useStore((state) => state.showResources);
  const meshRef = useRef();
  const terrainGeometry = useRef(new BufferGeometry());
  const offset = useRef({ x: 0, y: 0 });
  const direction = useRef({ x: 0, y: -1 });
  const customSpeed = useRef(1);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [resources, setResources] = useState([]);

  const raycaster = new Raycaster();

  const handleObjectClick = ({ point, face }) => {
    setSelectedPoint(point);
    if (face) {
      const vertexIndex = face.a;
      console.log("Resource:", { resources, vertexIndex }, resources[vertexIndex]);
    }
  };

  useKeyboardControls({direction, customSpeed})
  useCanvasClick(camera, raycaster, handleObjectClick, meshRef);


  useEffect(() => {
    const { resources: generatedResources } = generateTerrain(
      width, depth, resolution, scale, seed, offsetX, offsetY, terrainGeometry.current, showResources
    );
    setResources(generatedResources);
  }, [width, depth, resolution, scale, seed, offsetX, offsetY, showResources]);


  const updateTerrainGeometry = () => {
    const { colors } = generateTerrain( width, depth, resolution, scale, seed,
      offset.current.x + offsetX,
      offset.current.y + offsetY,
      terrainGeometry.current,
      showResources
    );
    terrainGeometry.current.setAttribute('color', new Float32BufferAttribute(colors, 3));
  
    if (meshRef.current) {
      meshRef.current.geometry = terrainGeometry.current;
    }
  };

  useFrame(() => {
    offset.current.x += direction.current.x * (speed * customSpeed.current);
    offset.current.y += direction.current.y * (speed * customSpeed.current);
  
    updateTerrainGeometry();

  });

  return (
    <mesh ref={meshRef} geometry={terrainGeometry.current} >
      <meshStandardMaterial wireframe={true} vertexColors side={DoubleSide} />
    </mesh>
  );
};

const App = () => {
  const toggleShowResources = useStore((state) => state.toggleShowResources); 

  return (
    <>
      <button onClick={toggleShowResources}>Toggle Resource View</button>
      <Stats />
      <Canvas flat shadows camera={{ position: [200, 200, 200], fov: 25 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
        <Terrain />
        <OrbitControls />
      </Canvas>
    </>
  );
};

export default App;
