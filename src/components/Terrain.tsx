import { useCallback, useMemo, useRef } from "react";
import { BufferAttribute, BufferGeometry, Float32BufferAttribute } from "three";

export function useTerrainGeometry({ width, depth, resolution, scale, seed, offsetX, offsetY }) {
    const terrainGeometry = useRef(new BufferGeometry());
    const indices = useMemo(() => {
      const indicesPrecalc = new Uint16Array(Math.floor(width / resolution) * Math.floor(depth / resolution) * 6);
      generateIndices(width, depth, indicesPrecalc);
      return indicesPrecalc;
    }, [width, depth, resolution]);
  
    const colors = useRef(new Float32Array((Math.floor(width / resolution) + 1) * (Math.floor(depth / resolution) + 1) * 3));
    const positions = useRef(new Float32Array((Math.floor(width / resolution) + 1) * (Math.floor(depth / resolution) + 1) * 3));
    const noise2D = useMemo(() => createNoise2D(seedrandom(seed)), [seed]);

    const colorAttribute = useRef(new Float32BufferAttribute(colors.current, 3));
    const indexAttribute = useRef(new BufferAttribute(indices, 1));
  
    const updateTerrainGeometry = useCallback(() => {
      const { colors: generatedColors, resources: generatedResources } = generateTerrain(
        width, depth, resolution, scale, noise2D,
        offsetX, offsetY, terrainGeometry.current,
      );
  
      // Setup and update the geometry attributes
    //   const colorAttribute = new Float32BufferAttribute(generatedColors, 3);
      colorAttribute.current.needsUpdate = true;
      terrainGeometry.current.setIndex(indexAttribute.current);
      terrainGeometry.current.setAttribute("color", colorAttribute.current);
      
      return generatedResources;
    }, [width, depth, resolution, scale, seed, offsetX, offsetY]);
  
    return { terrainGeometry, updateTerrainGeometry };
  }

function generateIndices(width: any, depth: any, indicesPrecalc: Uint16Array) {
    throw new Error("Function not implemented.");
}

function createNoise2D(arg0: any): any {
    throw new Error("Function not implemented.");
}

function seedrandom(seed: any): any {
    throw new Error("Function not implemented.");
}

function generateTerrain(width: any, depth: any, resolution: any, scale: any, noise2D: any, offsetX: any, offsetY: any, current: BufferGeometry<import("three").NormalBufferAttributes>): { colors: any; resources: any; } {
    throw new Error("Function not implemented.");
}
  