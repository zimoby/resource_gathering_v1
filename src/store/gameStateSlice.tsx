import { StateCreator } from "zustand";
import { GameStoreState } from "./store";
import { ResourceType, resourceTypes } from "./worldParamsSlice";
import { generateWeather } from "../utils/generators";
import { WeatherCondition } from "./worldParamsSlice";
import { consoleLog } from "../utils/functions";

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

export interface CostsT {
  [key: string]: { name: string; value: number, valueAlt?: string };
}

export interface GameStateSlice {
  disableAnimations: boolean;
  disableSounds: boolean;
  educationMode: boolean;
  invertDirection: boolean;
  showSettingsModal: boolean;
  startScreen: boolean;
  firstStart: boolean;
  terrainLoading: boolean;
  terrainAppearing: boolean;
  animationFirstStage: boolean;

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
  updateDisableAnimationsInStorage: (value: boolean) => void;
  updateEducationMode: (value: boolean) => void;
  resetEducationMode: () => void;
  replacePropWithXY: (name: string, value: Offset) => void;
  addLog: (log: string) => void;
  addEventLog: (eventName: string) => void;
  removeFirstEventLog: () => void;
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
  invertDirection: localStorage.getItem("invertDirection") === "true",

  showSettingsModal: false,

  startScreen:
    localStorage.getItem("startScreen") === "true" ||
    localStorage.getItem("startScreen") === null,

  firstStart: false,
  terrainLoading: true,
  terrainAppearing: false,
  animationFirstStage: false,

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
    const { beacons, collectedResources, playerPoints, canPlaceBeacon, costs, addEventLog } = get();
  
    const newCollectedResources = beacons.reduce((resources, beacon) => {
      resources[beacon.resource] = (resources[beacon.resource] || 0) + 1;
      return resources;
    }, { ...collectedResources });

    const pointsEarned = beacons.reduce((total, beacon) => total + resourceTypes[beacon.resource].score, 0);
    let newPlayerPoints = playerPoints + pointsEarned;
  
    let message = "";
    if (canPlaceBeacon) {
      if (newPlayerPoints >= costs.scanning.value) {
        newPlayerPoints -= costs.scanning.value;
        addEventLog(`Scanning. -${costs.scanning.value} energy`);
      } else {
        message = `Not enough energy to scan. Need ${costs.scanning.value} energy`;
      }
    }

    set({
      collectedResources: newCollectedResources,
      playerPoints: newPlayerPoints,
      message: message
    });
  },
  
  message: "",
  logs: [],
  eventsLog: [],
  scanRadius: 30,
  canPlaceBeacon: false,
  activePosition: { x: 0, y: 0, z: 0 },
  weatherCondition: "mild",

  costs: {
    scanning: { name: "Scanning per sec", value: 50 },
    flyToNewWorld: { name: "Fly to new world", value: 10000 },
    placeBeacon: { name: "Place beacon", value: 100 },
    extendBeaconLimits: { name: "Extend beacon limits", value: 1000 },
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
});