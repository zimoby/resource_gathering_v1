import { StateCreator } from "zustand";
import { generateArtefacts, generateRandomColor, generateWorld } from "../utils/generators";
import { GameStoreState } from "./store";
import { Color } from "three";

export const minLevel = -10;
export const maxLevel = 20;

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

export type MapDetailesType = [
  largeDetailes: number,
  mediumDetailes: number,
  smallDetailes: number
];

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
  mapDetailes: MapDetailesType;
};

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

export interface TerrainTypesT {
  [key: string]: Terrain;
}

export interface ResourceTypesT {
  [key: string]: Resource;
}

export interface ArtefactsCollectedT {
  [key: string]: number;
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

export type ArtefactType = "usual" | "rare" | "legendary";

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

export interface ArtefactT {
  x: number;
  y: number;
  z: number;
  type: ArtefactType;
  chunkX: number;
  chunkY: number;
  visible: boolean;
  id: string;
}

export interface WorldParamsSlice {
  worldParams: WorldParamsType;
  beacons: BeaconType[];
  beaconsLimit: number;

  artefacts: ArtefactT[];
  artefactsCollectedByTypes: ArtefactsCollectedT;
  artefactSelected: string;
  terrainColors: TerrainTypesT;

  regenerateWorld: () => void;
  increaseBeconsLimit: () => void;
  addArtefactToCollection: (type: ArtefactType) => void;
}

export const artefactAmount = 10;

export const createWorldParamsSlice: StateCreator<GameStoreState, [], [], WorldParamsSlice> = (
  set
) => ({
  beacons: [],
  beaconsLimit: 10,

  increaseBeconsLimit: () => {
    set((state) => {
      if (state.playerPoints >= state.costs.extendBeaconLimits.value) {
        return {
          beaconsLimit: state.beaconsLimit + 1,
          playerPoints: state.playerPoints - state.costs.extendBeaconLimits.value,
          message: `Beacons limit increased to ${state.beaconsLimit + 1}`,
        };
      } else {
        return {
          message: `Not enough energy to increase beacons limit`,
        };
      }
    });
  },

  artefacts: generateArtefacts({ amount: artefactAmount }),
  artefactSelected: "",
  artefactsCollectedByTypes: {
    usual: 0,
    rare: 0,
    legendary: 0,
  },

  addArtefactToCollection: (type: ArtefactType) => {
    set((state) => {
      return {
        artefactsCollectedByTypes: {
          ...state.artefactsCollectedByTypes,
          [type]: state.artefactsCollectedByTypes[type] + 1,
        },
      };
    });
  },

  terrainColors: terrainTypes,

  worldParams: generateWorld(),
  regenerateWorld: () => {
    const newTerrainColors = {
      water: { color: generateRandomColor(), level: minLevel + 1 },
      grass: { color: generateRandomColor(), level: 0 },
      dirt: { color: generateRandomColor(), level: 5 },
      snow: { color: generateRandomColor(), level: 10 },
      default: { color: new Color(0xffffff), level: 0 },
    };

    set({
      worldParams: generateWorld(),
      terrainColors: newTerrainColors,
      artefacts: generateArtefacts({ amount: artefactAmount }),
      beacons: [],
      currentOffset: { x: 0, y: 0 },
      currentLocation: { x: 0, y: 0 },

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
