import { StateCreator } from "zustand";
import {
  GameStoreState,
  SETTING_DISABLE_ANIMATIONS,
  SETTING_DISABLE_MUSIC,
  SETTING_DISABLE_SOUNDS,
  SETTING_EDUCATION_MODE,
  SETTING_INVERT_DIRECTION,
  SETTING_START_SCREEN,
} from "./store";
import { ResourceType, resourceTypes } from "./worldParamsSlice";
import { generateWeather } from "../utils/generators";
import { WeatherCondition } from "./worldParamsSlice";
// import { consoleLog } from "../utils/functions";

export interface Offset {
  x: number;
  y: number;
}

export interface ChunkType {
  x: number;
  y: number;
}

export type CollectedResources = Record<string, number>;

export type CostsT = Record<
  string,
  { name: string; value: number; valueAlt?: string }
>;

export interface GameStateSlice {
  disableAnimations: boolean;
  disableSounds: boolean;
  disableMusic: boolean;
  educationMode: boolean;
  invertDirection: boolean;

  showSettingsModal: boolean;
  showAboutModal: boolean;

  startToLoadFiles: boolean;
  loadingProgress: number;

  startScreen: boolean;
  firstStart: boolean;
  terrainLoading: boolean;
  terrainAppearing: boolean;
  animationFirstStage: boolean;
  startStageFinished: boolean;

  resetValues: boolean;

  currentOffset: Offset;
  selectedResource: ResourceType;
  selectedChunk: ChunkType;
  currentLocation: ChunkType;
  moveDirection: Offset;
  dynamicSpeed: number;
  playerPoints: number;
  decreasePlayerPoints: (points: number) => void;

  updateResourcesAndPoints: () => void;
  collectedResources: CollectedResources;
  message: string;
  addNewMessage: (message: string) => void;
  logs: string[];
  eventsLog: string[];
  scanRadius: number;
  canPlaceBeacon: boolean;
  activePosition: { x: number; y: number; z: number };
  weatherCondition: WeatherCondition;
  costs: CostsT;
  updateWeather: () => WeatherCondition | null;
  updateStoreProperty: (paramName: string, value: unknown) => void;
  updateVariableInLocalStorage: (variableName: string, value: boolean) => void;
  addLog: (log: string) => void;
  addEventLog: (eventName: string) => void;
}

export const createGameStateSlice: StateCreator<
  GameStoreState,
  [],
  [],
  GameStateSlice
> = (set, get) => ({

  disableAnimations: localStorage.getItem(SETTING_DISABLE_ANIMATIONS) === "true",
  disableSounds: localStorage.getItem(SETTING_DISABLE_SOUNDS) === "true",
  disableMusic: localStorage.getItem(SETTING_DISABLE_MUSIC) === "true",
  educationMode: localStorage.getItem(SETTING_EDUCATION_MODE) === "true",
  invertDirection: localStorage.getItem(SETTING_INVERT_DIRECTION) === "true",
  startScreen: localStorage.getItem(SETTING_START_SCREEN) === "true",

  showSettingsModal: false,
  showAboutModal: false,

  startToLoadFiles: false,
  loadingProgress: 0,

  firstStart: false,
  terrainLoading: true,
  terrainAppearing: false,
  animationFirstStage: false,
  startStageFinished: false,

  resetValues: false,

  currentOffset: { x: 0, y: 0 },
  selectedResource: "Water",
  selectedChunk: { x: 0, y: 0 },
  currentLocation: { x: 0, y: 0 },
  moveDirection: { x: 0, y: -1 },
  dynamicSpeed: 1,

  playerPoints: 1000,

  decreasePlayerPoints: (points: number) => {
    set((state) => {
      return { playerPoints: state.playerPoints - points };
    });
  },

  collectedResources: {
    Water: 0,
    Metals: 0,
    "Rare Elements": 0,
    Hydrocarbons: 0,
  },

  updateResourcesAndPoints: () => {
    const {
      beacons,
      collectedResources,
      playerPoints,
      canPlaceBeacon,
      costs,
      addEventLog,
    } = get();

    const newCollectedResources = beacons.reduce(
      (resources, beacon) => {
        resources[beacon.resource] = (resources[beacon.resource] || 0) + 1;
        return resources;
      },
      { ...collectedResources },
    );

    const pointsEarned = beacons.reduce(
      (total, beacon) => total + resourceTypes[beacon.resource].score,
      0,
    );
    let newPlayerPoints = playerPoints + pointsEarned;

    // let message = "";
    if (canPlaceBeacon) {
      if (newPlayerPoints >= costs.scanning.value) {
        newPlayerPoints -= costs.scanning.value;
        addEventLog(`Scanning. -${costs.scanning.value} energy`);
      } else {
        // message = `Not enough energy to scan. Need ${costs.scanning.value} energy`;
      }
    }

    set({
      collectedResources: newCollectedResources,
      playerPoints: newPlayerPoints,
      // message: message
    });
  },

  message: "",

  addNewMessage: (message: string) => {
    if (get().message === message) {
      return;
    }
    set({ message });
  },

  logs: [],
  eventsLog: [],
  scanRadius: 30,
  canPlaceBeacon: false,
  activePosition: { x: 0, y: 0, z: 0 },
  weatherCondition: "Mild",

  costs: {
    scanning: { name: "Scanning per sec", value: 50 },
    flyToNewWorld: { name: "Fly to new world", value: 10000 },
    placeBeacon: { name: "Place beacon", value: 100 },
    extendBeaconLimits: { name: "Extend beacons limits", value: 1000 },
  },
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
});
