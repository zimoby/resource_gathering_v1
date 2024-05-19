import { Color } from "three";
import { create } from "zustand";
import { WorldParamsSlice, createWorldParamsSlice } from "./store/worldParamsSlice";
import { UiPanelsStateSlice, createUiPanelsStateSlice } from "./store/uiPanelsStateSlice";
import { MapParamsSlice, createMapParamsSlice } from "./store/mapParamsSlice";
import { GameStateSlice, createGameStateSlice } from "./store/gameStateSlice";

export const minLevel = -10;
export const maxLevel = 100;

export const DEV_MODE = import.meta.env.VITE_APP_MODE === "development";

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
  "Water": {
    color: new Color(0xffffff), // white
    threshold: 0.1,
    score: 10,
  },
  "Metals": {
    color: new Color(0xffa500), // orange
    threshold: 0.2,
    score: 7,
  },
  "Rare Elements": {
    color: new Color(0x800080), // purple
    threshold: 0.4,
    score: 5,
  },
  "Hydrocarbons": {
    color: new Color(0xff4080), // pink
    threshold: 1,
    score: 1,
  },
};

export type GameStoreState = WorldParamsSlice &
  UiPanelsStateSlice &
  MapParamsSlice &
  GameStateSlice;

export const useGameStore = create<GameStoreState>((...a) => ({
  ...createWorldParamsSlice(...a),
  ...createUiPanelsStateSlice(...a),
  ...createMapParamsSlice(...a),
  ...createGameStateSlice(...a),
}));