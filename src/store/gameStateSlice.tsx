import { StateCreator } from "zustand";
import { GameStoreState, ResourceType } from "../store";
import { generateWeather } from "../utils/generators";
import { WeatherCondition } from "./worldParamsSlice";

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

export interface GameStateSlice {
  disableAnimations: boolean;
  disableSounds: boolean;
  educationMode: boolean;
  showSettingsModal: boolean;
  startScreen: boolean;
  firstStart: boolean;
  terrainLoading: boolean;
  terrainAppearing: boolean;
  animationFirstStage: boolean;
  currentOffset: Offset;
  selectedResource: ResourceType;
  selectedChunk: ChunkType;
  currentLocation: ChunkType;
  moveDirection: Offset;
  dynamicSpeed: number;
  beacons: BeaconType[];
  playerPoints: number;
  collectedResources: CollectedResources;
  message: string;
  logs: string[];
  eventsLog: string[];
  scanRadius: number;
  canPlaceBeacon: boolean;
  activePosition: { x: number; y: number; z: number };
  weatherCondition: WeatherCondition;
  updateWeather: () => WeatherCondition | null;
  updateStoreProperty: (paramName: string, value: unknown) => void;
  updateVariableInLocalStorage: (variableName: string, value: boolean) => void;
  updateDisableAnimationsInStorage: (value: boolean) => void;
  updateEducationMode: (value: boolean) => void;
  resetEducationMode: () => void;
  replacePropWithXY: (name: string, value: Offset) => void;
  addLog: (log: string) => void;
  addEventLog: (eventName: string) => void;
  removeFirstEventLog: () => void;
  resetCurrentOffset: () => void;
  resetCurrentLocation: () => void;
  resetActivePosition: () => void;
}

export const createGameStateSlice: StateCreator<
  GameStoreState,
  [],
  [],
  GameStateSlice
> = (set, get) => ({
  disableAnimations: localStorage.getItem("disableAnimations") === "true",
  disableSounds: localStorage.getItem("disableSounds") === "true",
  educationMode: localStorage.getItem("educationMode") === "true",

  showSettingsModal: false,

  startScreen:
    localStorage.getItem("startScreen") === "true" ||
    localStorage.getItem("startScreen") === null,

  firstStart: false,
  terrainLoading: true,
  terrainAppearing: false,
  animationFirstStage: false,
  
  currentOffset: { x: 0, y: 0 },
  selectedResource: "Water",
  selectedChunk: { x: 0, y: 0 },
  currentLocation: { x: 0, y: 0 },
  moveDirection: { x: 0, y: -1 },
  dynamicSpeed: 1,
  beacons: [],
  playerPoints: 1000,
  collectedResources: {
    Water: 0,
    Metals: 0,
    "Rare Elements": 0,
    Hydrocarbons: 0,
  },
  message: "",
  logs: [],
  eventsLog: [],
  scanRadius: 30,
  canPlaceBeacon: false,
  activePosition: { x: 0, y: 0, z: 0 },
  weatherCondition: "mild",
  updateWeather: (): WeatherCondition | null => {
    const newWeather = generateWeather();
    if (newWeather === get().weatherCondition) {
      return null;
    } else {
      set({ weatherCondition: newWeather });
      return newWeather;
    }
  },
  updateStoreProperty: (paramName, value) => {
    set(() => ({ [paramName]: value }));
  },
  updateVariableInLocalStorage: (variableName: string, value: boolean) => {
    set({ [variableName]: value });
    localStorage.setItem(variableName, value.toString());
  },
  updateDisableAnimationsInStorage: (value: boolean) => {
    set({ disableAnimations: value });
    localStorage.setItem("disableAnimations", value.toString());
  },
  updateEducationMode: (value: boolean) => {
    set({ educationMode: value });
    localStorage.setItem("educationMode", value.toString());
  },
  resetEducationMode: () => {
    set({ educationMode: true });
    localStorage.setItem("educationMode", "true");
  },
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
  addEventLog: (eventName) => {
    set((state) => {
      const updatedEvents = [...state.eventsLog, eventName];
      if (updatedEvents.length > 5) {
        updatedEvents.shift();
      }
      return { eventsLog: updatedEvents };
    });
  },
  removeFirstEventLog: () => {
    set((state) => {
      const updatedEvents = [...state.eventsLog];
      updatedEvents.shift();
      return { eventsLog: updatedEvents };
    });
  },
  resetCurrentOffset: () => set({ currentOffset: { x: 0, y: 0 } }),
  resetCurrentLocation: () => set({ currentLocation: { x: 0, y: 0 } }),
  resetActivePosition: () => set({ activePosition: { x: 0, y: 0, z: 0 } }),
});