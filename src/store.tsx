import { Color } from "three";
import create from "zustand";
import { generateWeather } from "./components/weatherSystem";

export const minLevel = -10;
export const maxLevel = 100;

export type TerrainType = "water" | "grass" | "dirt" | "snow" | "default";
export type ResourceType = "r1" | "r2" | "r3" | "r4";
export type WeatherCondition = "mild" | "moderate" | "severe";

export interface Terrain {
  color: Color;
  level: number;
}

export interface Resource {
  color: Color;
  threshold: number;
  score: number;
}

export interface GridConfig {
  chunkSize: number;
  subGrids: number;
  lineWidth: number;
  gridColor: string;
  subGridColor: string;
}

export interface MapParams {
  width: number;
  depth: number;
  resolution: number;
  scale: number;
  seed: string;
  offsetX: number;
  offsetY: number;
  speed: number;
}

export interface Offset {
  x: number;
  y: number;
}

export interface ChunkType {
  x: number;
  y: number;
}

export interface CollectedResources {
  [key: string]: number;
}

export interface BeaconType {
  x: number;
  y: number;
  z: number;
  resource: ResourceType;
  chunkX: number;
  chunkY: number;
  visible: boolean;
  id: string;
}

export interface GamaStoreState {
  firstStart: boolean;
  loading: boolean;
  gridConfig: GridConfig;
  mapParams: MapParams;
  currentOffset: Offset;
  showResources: boolean;
  selectedResource: ResourceType;
  selectedChunk: ChunkType;
  currentLocation: ChunkType;
  moveDirection: Offset;
  dynamicSpeed: number;
  beacons: BeaconType[];
  playerPoints: number;
  collectedResources: CollectedResources;
  planetParams: {
    name: string;
    seed: string;
  };
  logs: string[];
  message: string;
  scanRadius: number;
  canPlaceBeacon: boolean;
  activePosition: { x: number; y: number; z: number };
  weatherCondition: WeatherCondition;
  updateWeather: () => void;
  toggleShowResources: () => void;
  replacePropWithXY: (name: string, value: Offset) => void;
  addLog: (log: string) => void;
}

interface TerrainTypesT {
  [key: string]: Terrain;
}

export const terrainTypes: TerrainTypesT = {
  water: {
    color: new Color(0x0000ff), // blue
    level: minLevel + 1,
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
    color: new Color(0xffffff), // brown
    level: 0,
  },
};

export interface ResourceTypesT {
  [key: string]: Resource;
}

export const resourceTypes: ResourceTypesT = {
  r1: {
    color: new Color(0xffffff), // white
    threshold: 0.1,
    score: 10,
  },
  r2: {
    color: new Color(0xffa500), // orange
    threshold: 0.2,
    score: 7,
  },
  r3: {
    color: new Color(0x800080), // purple
    threshold: 0.4,
    score: 5,
  },
  r4: {
    color: new Color(0xff4080), // pink
    threshold: 1,
    score: 1,
  },
};

const useGamaStore = create<GamaStoreState>((set) => ({
  firstStart: false,
  loading: true,
  gridConfig: {
    chunkSize: 1,
    subGrids: 5,
    lineWidth: 0.2,
    gridColor: "#ff0000",
    subGridColor: "#ffffff",
  },
  mapParams: {
    width: 100,
    depth: 100,
    resolution: 3,
    scale: 50,
    seed: "42",
    offsetX: 0,
    offsetY: 0,
    speed: 0.1,
  },
  currentOffset: { x: 0, y: 0 },
  showResources: false,
  selectedResource: "r1",
  selectedChunk: { x: 0, y: 0 },
  currentLocation: { x: 0, y: 0 },
  moveDirection: { x: 0, y: -1 },
  dynamicSpeed: 1,
  beacons: [],
  playerPoints: 1000,
  collectedResources: {
    r1: 0,
    r2: 0,
    r3: 0,
    r4: 0,
  },
  planetParams: {
    name: "Earth",
    seed: "42",
  },
  message: "",
  logs: [],
  scanRadius: 30,
  canPlaceBeacon: false,
  activePosition: { x: 0, y: 0, z: 0},
  weatherCondition: "mild",
  toggleShowResources: () =>
    set((state) => ({ showResources: !state.showResources })),
  replacePropWithXY: (name, value) => {
    set(() => ({ [name]: { x: value.x, y: value.y } }));
  },
  addLog: (log) => {
    set((state) => {
      const updatedLogs = [log, ...state.logs];
      if (updatedLogs.length > 10) {
        updatedLogs.pop();
      }
      return { logs: updatedLogs };
    });
  },
  updateWeather: () => {
    const newWeather = generateWeather();
    set({ weatherCondition: newWeather });
  },
}));

export default useGamaStore;