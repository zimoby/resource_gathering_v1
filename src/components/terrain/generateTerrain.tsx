import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  NormalBufferAttributes
} from "three";
import { minLevel, terrainTypes, resourceTypes, ResourceType } from "../../store";
import { NoiseFunction2D } from "simplex-noise";

const updateBufferAttribute = (geometry: BufferGeometry<NormalBufferAttributes>, attrName: string, data: Float32Array) => {
  const attr = geometry.getAttribute(attrName);
  if (attr && attr.array.length === data.length) {
    attr.array.set(data);
    attr.needsUpdate = true;
  } else {
    geometry.setAttribute(attrName, new Float32BufferAttribute(data, 3));
    console.log("new attribute created", attrName);
  }
};

const getResourceColor = (resourceType: ResourceType) => {
  return resourceTypes[resourceType]?.color || new Color(0xffffff);
};

const checkResource = (height: number) => {
  for (const [type, { level }] of Object.entries(terrainTypes) as [string, { color: Color; level: number; }][] ) {
    if (height < level) {
      return type;
    }
  }
  return "default";
};

const applyTerrainColors = (
  positions: Float32Array,
  colors: Float32Array,
  widthCount: number,
  depthCount: number,
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

const applyResources = ({ resources, widthCount, depthCount, scale, offsetX, offsetY, noise2D }:
  { resources: Array<string | null>; widthCount: number; depthCount: number; scale: number; offsetX: number; offsetY: number; noise2D: NoiseFunction2D; }
) => {
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

const generateHeight = (x: number, y: number, scale: number, offsetX: number, offsetY: number, noise2D: NoiseFunction2D) => {
  const scaleCorrection = scale * 5;
  const largeScale = noise2D((x + offsetX) / scaleCorrection, (y + offsetY) / scaleCorrection) * 0.5;
  const mediumScale = noise2D((x + offsetX) / (scaleCorrection * 0.5), (y + offsetY) / (scaleCorrection * 0.5)) * 0.25; 
  const smallScale = noise2D((x + offsetX) / (scaleCorrection * 0.25), (y + offsetY) / (scaleCorrection * 0.25)) * 0.25;

  // return Math.pow(largeScale, 1);
  const combined = largeScale + mediumScale + smallScale;

  if (combined >= 0) {
    return Math.pow(combined, 3 / 4);
  } else {
    return combined;
  }
};

export const generateTerrain = (
  width: number,
  depth: number,
  resolution: number,
  scale: number,
  noise2D: NoiseFunction2D,
  offsetX: number,
  offsetY: number,
  geometry: BufferGeometry<NormalBufferAttributes>,
  canPlaceBeacon: boolean,
  activePosition: { x: number; z: number; },
  scanRadius = 0,
  resources: Array<ResourceType>,
  colors: Float32Array,
  positions: Float32Array,
  widthCount: number,
  depthCount: number
) => {
  const heightMultiplier = 20;
  const baseLineOffset = -5;

  for (let i = 0; i <= depthCount; i++) {
    for (let j = 0; j <= widthCount; j++) {
      const x = j * resolution - width / 2;
      const heightNoise = generateHeight(x, i * resolution, scale, offsetX, offsetY, noise2D);
      // console.log("heightNoise:", heightNoise);
      const y = Math.max(heightNoise * heightMultiplier + baseLineOffset, minLevel);
      // const y = Math.max(heightNoise * (heightMultiplier + heightMultiplier / 2) - heightMultiplier / 2, -heightMultiplier);
      const z = i * resolution - depth / 2;
      const idx = (i * (widthCount + 1) + j) * 3;
      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;
    }
  }

  applyTerrainColors(positions, colors, widthCount, depthCount);


  // if (canPlaceBeacon) {
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
  // const alwaycanPlaceBeacon = true;  
  if (canPlaceBeacon) {
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

  applyResources({ resources, widthCount, depthCount, scale, offsetX, offsetY, noise2D });

  updateBufferAttribute(geometry, "color", colors);
  updateBufferAttribute(geometry, "position", positions);

  return { colors, resources };
};
