import { StateCreator } from "zustand";
import { generateWorld } from "../utils/generators";
import { GameStoreState } from "../store";

export type WorldState =
  | "extreme"
  | "danger"
  | "normal"
  | "safe"
  | "hazardous"
  | "stormy"
  | "extreme temperature";

export type WeatherCondition = "mild" | "moderate" | "severe";

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
