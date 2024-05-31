import { StateCreator } from "zustand";
import {
  generateArtifacts,
  generateRandomColor,
  generateWorld,
} from "../utils/generators";
import { GameStoreState } from "./store";
import { Color } from "three";

export const minLevel = -10;
export const maxLevel = 20;

export type TerrainType = "water" | "grass" | "dirt" | "snow" | "default";

export type WeatherCondition = "Mild" | "Moderate" | "Severe";
export interface WorldState {
  value:
    | "Extreme"
    | "Danger"
    | "Normal"
    | "Safe"
    | "Hazardous"
    | "Stormy"
    | "Extreme temperature";
  name: string;
}

export interface Terrain {
  color: Color;
  level: number;
}

export interface Resource {
  color: Color;
  threshold: number;
  score: number;
}

export type MapDetailesType = [
  largeDetailes: number,
  mediumDetailes: number,
  smallDetailes: number,
];

export interface WorldNumberParamT {
  name: string;
  value: number;
  max: number;
  min: number;
}

export interface WorldStringParamT {
  name: string;
  value: string;
}

export interface WorldParamsType {
  seed: WorldStringParamT;
  worldState: WorldState;
  name: WorldStringParamT;
  temperature: WorldNumberParamT;
  humidity: WorldNumberParamT;
  windSpeed: WorldNumberParamT;
  pollution: WorldNumberParamT;
  radiation: WorldNumberParamT;
  weatherCondition: WeatherCondition;
  mapDetailes: MapDetailesType;
}

const classicTerrainPalette = {
  water: new Color(0x0000ff), // blue
  grass: new Color(0x00ff00), // green
  dirt: new Color(0xff0000), // red
  snow: new Color(0xffffff), // white
};

export const terrainTypes: TerrainTypesT = {
  water: {
    color: classicTerrainPalette.water,
    level: minLevel + 1,
  },
  grass: {
    color: classicTerrainPalette.grass,
    level: 0,
  },
  dirt: {
    color: classicTerrainPalette.dirt,
    level: 5,
  },
  snow: {
    color: classicTerrainPalette.snow,
    level: 10,
  },
  default: {
    color: new Color(0xffffff),
    level: 0,
  },
};

export type TerrainTypesT = Record<string, Terrain>;
export type ResourceTypesT = Record<string, Resource>;
export type ArtifactsCollectedT = Record<string, number>;

export type ResourceType =
  | "Water"
  | "Metals"
  | "Rare Elements"
  | "Hydrocarbons"
  | "empty";

export const resourceNames = [
  "Water",
  "Metals",
  "Rare Elements",
  "Hydrocarbons",
];

export const resourceTypes: ResourceTypesT = {
  [resourceNames[0]]: {
    color: new Color(16777215), // white
    threshold: 0.1,
    score: 10,
  },
  [resourceNames[1]]: {
    color: new Color(16753920), // orange
    threshold: 0.2,
    score: 7,
  },
  [resourceNames[2]]: {
    color: new Color(8388736), // purple
    threshold: 0.4,
    score: 5,
  },
  [resourceNames[3]]: {
    color: new Color(16728192), // pink
    threshold: 1,
    score: 1,
  },
};

export const parseResourcesColors = (): { color: number[] }[] => {
  const resColors = Object.keys(resourceTypes).map((key) => {
    return {
      color: [
        resourceTypes[key].color.r,
        resourceTypes[key].color.g,
        resourceTypes[key].color.b,
      ],
    };
  });

  return resColors;
};

export type ArtifactType = "usual" | "rare" | "legendary";

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

export interface ArtifactT {
  x: number;
  y: number;
  z: number;
  type: ArtifactType;
  chunkX: number;
  chunkY: number;
  visible: boolean;
  id: string;
  name: string;
  params: Record<string, { name: string; value: number }>;
  worldId: string;
}

export interface WorldParamsSlice {
  worldParams: WorldParamsType;
  beacons: BeaconType[];
  beaconsLimit: number;

  artifacts: ArtifactT[];
  artifactsArray: ArtifactT[];
  artifactsCollectedByTypes: ArtifactsCollectedT;
  artifactSelected: string;
  terrainColors: TerrainTypesT;

  visitedWorlds: WorldParamsType[];
  addVisitedWorld: (params: WorldParamsType) => void;

  regenerateWorld: () => void;
  increaseBeconsLimit: () => void;
  addArtifactToCollection: (type: ArtifactType) => void;
  addToArtifactsArray: (artifact: ArtifactT) => void;
}

export const artifactAmount = 10;

export const createWorldParamsSlice: StateCreator<
  GameStoreState,
  [],
  [],
  WorldParamsSlice
> = (set, get) => ({
  beacons: [],
  beaconsLimit: 10,

  increaseBeconsLimit: () => {
    set((state) => {
      if (state.playerPoints >= state.costs.extendBeaconLimits.value) {
        return {
          beaconsLimit: state.beaconsLimit + 1,
          playerPoints:
            state.playerPoints - state.costs.extendBeaconLimits.value,
          message: `Beacons limit increased to ${state.beaconsLimit + 1}`,
        };
      } else {
        return {
          message: `Not enough energy to increase beacons limit`,
        };
      }
    });
  },

  artifacts: generateArtifacts({ amount: artifactAmount }),
  artifactSelected: "",
  artifactsCollectedByTypes: {
    usual: 0,
    rare: 0,
    legendary: 0,
  },
  addArtifactToCollection: (type: ArtifactType) => {
    set((state) => {
      return {
        artifactsCollectedByTypes: {
          ...state.artifactsCollectedByTypes,
          [type]: state.artifactsCollectedByTypes[type] + 1,
        },
      };
    });
  },
  artifactsArray: [],

  addToArtifactsArray: (artifact: ArtifactT) => {
    set((state) => {
      return {
        artifactsArray: [...state.artifactsArray, artifact],
      };
    });
  },

  terrainColors: terrainTypes,

  visitedWorlds: [],

  worldParams: generateWorld(),
  regenerateWorld: () => {
    const newTerrainColors = {
      water: { color: generateRandomColor(), level: minLevel + 1 },
      grass: { color: generateRandomColor(), level: 0 },
      dirt: { color: generateRandomColor(), level: 5 },
      snow: { color: generateRandomColor(), level: 10 },
      default: { color: new Color(0xffffff), level: 0 },
    };

    const newWorldParams = generateWorld();

    set({
      worldParams: newWorldParams,
      terrainColors: newTerrainColors,
      artifacts: generateArtifacts({
        amount: artifactAmount,
        worldId: newWorldParams.seed.value,
      }),
      beacons: [],
      currentOffset: { x: 0, y: 0 },
      currentLocation: { x: 0, y: 0 },
      locationsHistory: [{ x: 0, y: 0 }],

      collectedResources: {
        Water: 0,
        Metals: 0,
        "Rare Elements": 0,
        Hydrocarbons: 0,
      },
      message: "",
      scanRadius: 30,
      weatherCondition: "Mild",
    });
    get().addVisitedWorld(newWorldParams);
  },
  addVisitedWorld: (params: WorldParamsType) => {
    const { visitedWorlds } = get();
    const isUnique = !visitedWorlds.some(
      (world) => JSON.stringify(world) === JSON.stringify(params),
    );

    if (isUnique) {
      set({ visitedWorlds: [...visitedWorlds, params] });
    }
  },
});
