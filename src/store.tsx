import { Color } from "three";
import { create } from "zustand";
import { generateWeather, generateWorld } from "./utils/generators";
// import { persist } from "zustand/middleware";

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

export interface GameStoreActions {
  regenerateWorld: () => void;

  setMapAnimationState: (state: 'idle' | 'shrinking' | 'enlarging') => void;
  
  updateStoreProperty: (paramName: string, value: unknown) => void;
  updateMapSize: (value: number) => void;
  updateMapParam: (paramName: string, value: unknown) => void;
  toggleShowResources: () => void;
  replacePropWithXY: (name: string, value: Offset) => void;
  addLog: (log: string) => void;
  addEventLog: (eventName: string) => void;
  removeFirstEventLog: () => void;
  updateWeather: () => WeatherCondition | null;
  updateEducationMode: (value: boolean) => void;
  resetEducationMode: () => void;
  updateVariableInLocalStorage: (variableName: string, value: boolean) => void;
  updateDisableAnimationsInStorage: (value: boolean) => void;

  soloPanelOpacity: (panelName: PanelNamesT) => void;
  updatePanelOpacity: (panelName: PanelNamesT, value: number) => void;
  resetPanelsOpacity: () => void;
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

type UiPanelsStateType = {
  opacity: number;
};

export type GameStoreState = {
  disableAnimations: boolean;
  disableSounds: boolean;
  educationMode: boolean;

  showSettingsModal: boolean;

  worldParams: WorldParamsType;
  uiPanelsState: {
    titlePanel: UiPanelsStateType;
    planetPanel: UiPanelsStateType;
    collectedResourcesPanel: UiPanelsStateType;
    scanerPanel: UiPanelsStateType;
    progressPanel: UiPanelsStateType;
    systemMessagePanel: UiPanelsStateType;
    systemControlsPanel: UiPanelsStateType;
    logsPanel: UiPanelsStateType;
    beaconPanel: UiPanelsStateType;
    eventsPanel: UiPanelsStateType;
  };

  startScreen: boolean;
  firstStart: boolean;
  terrainLoading: boolean;
  terrainAppearing: boolean;
  animationFirstStage: boolean;

  mapAnimationState: 'idle' | 'shrinking' | 'enlarging';

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
  logs: string[];
  eventsLog: string[];
  message: string;
  scanRadius: number;
  canPlaceBeacon: boolean;
  activePosition: { x: number; y: number; z: number };
  weatherCondition: WeatherCondition;
} & GameStoreActions;

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

type PanelNamesT =
  | "titlePanel"
  | "planetPanel"
  | "collectedResourcesPanel"
  | "scanerPanel"
  | "progressPanel"
  | "systemMessagePanel"
  | "systemControlsPanel"
  | "logsPanel"
  | "beaconPanel"
  | "eventsPanel";

function createGameStore() {
  return create<GameStoreState>((set, get) => ({
    disableAnimations: localStorage.getItem("disableAnimations") === "true",
    disableSounds: localStorage.getItem("disableSounds") === "true",

    showSettingsModal: false,

    educationMode:
      localStorage.getItem("educationMode") === "true",

    startScreen:
      localStorage.getItem("startScreen") === "true" ||
      localStorage.getItem("startScreen") === null,

    firstStart: false,
    terrainLoading: true,
    terrainAppearing: false,
    animationFirstStage: false,

    mapAnimationState: 'idle',
    setMapAnimationState: (state) => set({ mapAnimationState: state }),

    worldParams: generateWorld(),

    regenerateWorld: () => {
      set({
        worldParams: generateWorld(),
        beacons: [],
        currentOffset: { x: 0, y: 0 },
        currentLocation: { x: 0, y: 0 },
        playerPoints: 1000,
        collectedResources: {
          "Water": 0,
          "Metals": 0,
          "Rare Elements": 0,
          "Hydrocarbons": 0,
        },
        message: "",
        scanRadius: 30,
        weatherCondition: "mild",
      });
    },

    uiPanelsState: {
      titlePanel: { opacity: 1 },
      planetPanel: { opacity: 1 },
      collectedResourcesPanel: { opacity: 1 },
      scanerPanel: { opacity: 1 },
      progressPanel: { opacity: 1 },
      systemMessagePanel: { opacity: 1 },
      systemControlsPanel: { opacity: 1 },
      logsPanel: { opacity: 1 },
      beaconPanel: { opacity: 1 },
      eventsPanel: { opacity: 1 },
    },

    updatePanelOpacity: (panelName: PanelNamesT, value: number) => {
      set((state) => ({
        uiPanelsState: {
          ...state.uiPanelsState,
          [panelName]: { opacity: value },
        },
      }));
    },

    soloPanelOpacity: (panelName: PanelNamesT) => {
      set((state) => {
        const newPanelsState = Object.keys(state.uiPanelsState).reduce((acc, key) => {
          acc[key as keyof typeof state.uiPanelsState] = { opacity: 0.1 };
          return acc;
        }, {} as typeof state.uiPanelsState);
        newPanelsState[panelName] = { opacity: 1 };
        return {
          uiPanelsState: newPanelsState,
        };
      });
    },

    resetPanelsOpacity: () => {
      set((state) => {
        const newPanelsState = Object.keys(state.uiPanelsState).reduce((acc, key) => {
          acc[key as keyof typeof state.uiPanelsState] = { opacity: 1 };
          return acc;
        }, {} as typeof state.uiPanelsState);
        return {
          uiPanelsState: newPanelsState,
        };
      });
    },

    gridConfig: {
      chunkSize: 1,
      subGrids: 5,
      lineWidth: 0.2,
      gridColor: "#ff0000",
      subGridColor: "#ffffff",
    },
    mapParams: {
      width: 200,
      depth: 200,
      resolution: 3,
      scale: 50,
      offsetX: 0,
      offsetY: 0,
      speed: 0.1,
    },
    currentOffset: { x: 0, y: 0 },
    showResources: false,
    selectedResource: "Water",
    selectedChunk: { x: 0, y: 0 },
    currentLocation: { x: 0, y: 0 },
    moveDirection: { x: 0, y: -1 },
    dynamicSpeed: 1,
    beacons: [],
    playerPoints: 1000,
    collectedResources: {
      "Water": 0,
      "Metals": 0,
      "Rare Elements": 0,
      "Hydrocarbons": 0,
    },

    message: "",
    logs: [],
    eventsLog: [],
    scanRadius: 30,
    canPlaceBeacon: false,
    activePosition: { x: 0, y: 0, z: 0 },
    weatherCondition: "mild",
    updateStoreProperty: (paramName, value) => {
      set(() => ({ [paramName]: value }));
    },
    updateMapSize: (value) => {
      // console.log("updateMapSize:", value);
      set((state) => ({ mapParams: { ...state.mapParams, width: value, depth: value } }));
    },
    updateMapParam: (paramName, value) => {
      set((state) => ({
        mapParams: { ...state.mapParams, [paramName]: value },
      }));
    },
    toggleShowResources: () => set((state) => ({ showResources: !state.showResources })),
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
        // console.log("updatedEvents add:", updatedEvents);
        return { eventsLog: updatedEvents };
      });
    },
    removeFirstEventLog: () => {
      set((state) => {
        const updatedEvents = [...state.eventsLog];
        updatedEvents.shift();
        // console.log("updatedEvents remove:", updatedEvents);
        return { eventsLog: updatedEvents };
      });
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
  }));
}

export const useGameStore = createGameStore();
