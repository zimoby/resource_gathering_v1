import { StateCreator } from "zustand";
import { generateWorld } from "../utils/generators";
import { GameStoreState } from "../store";
import { Color } from "three";

export const minLevel = -10;
export const maxLevel = 100;

export type TerrainType = "water" | "grass" | "dirt" | "snow" | "default";
export type ResourceType = "Water" | "Metals" | "Rare Elements" | "Hydrocarbons";
export type WeatherCondition = "mild" | "moderate" | "severe";
export type WorldState =
  | "extreme"
  | "danger"
  | "normal"
  | "safe"
  | "hazardous"
  | "stormy"
  | "extreme temperature";

export interface Terrain {
  color: Color;
  level: number;
}

export interface Resource {
  color: Color;
  threshold: number;
  score: number;
}

export type WorldParamsType = {
  seed: string;
  worldState: WorldState;
  name: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  pollution: number;
  radiation: number;
  weatherCondition: WeatherCondition;
};

export const terrainTypes: TerrainTypesT = {
  water: {
    color: new Color(255), // blue
    level: minLevel + 1,
  },
  grass: {
    color: new Color(32768), // green
    level: 0,
  },
  dirt: {
    color: new Color(10824234), // brown
    level: 5,
  },
  snow: {
    color: new Color(16777215), // white
    level: 10,
  },
  default: {
    color: new Color(16777215), // brown
    level: 0,
  },
};

export interface TerrainTypesT {
  [key: string]: Terrain;
}

export interface ResourceTypesT {
  [key: string]: Resource;
}

export const resourceTypes: ResourceTypesT = {
  Water: {
    color: new Color(16777215), // white
    threshold: 0.1,
    score: 10,
  },
  Metals: {
    color: new Color(16753920), // orange
    threshold: 0.2,
    score: 7,
  },
  "Rare Elements": {
    color: new Color(8388736), // purple
    threshold: 0.4,
    score: 5,
  },
  Hydrocarbons: {
    color: new Color(16728192), // pink
    threshold: 1,
    score: 1,
  },
};

export interface WorldParamsSlice {
  worldParams: WorldParamsType;
  regenerateWorld: () => void;
}

export const createWorldParamsSlice: StateCreator<GameStoreState, [], [], WorldParamsSlice> = (
  set
) => ({
  worldParams: generateWorld(),
  regenerateWorld: () => {
    set({
      worldParams: generateWorld(),
      beacons: [],
      currentOffset: { x: 0, y: 0 },
      currentLocation: { x: 0, y: 0 },

      playerPoints: 1000,
      collectedResources: {
        Water: 0,
        Metals: 0,
        "Rare Elements": 0,
        Hydrocarbons: 0,
      },
      message: "",
      scanRadius: 30,
      weatherCondition: "mild",
    });
  },
});
