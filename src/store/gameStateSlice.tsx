import { StateCreator } from "zustand";
import {
  DEV_MODE,
  GameStoreState,
  SETTING_DISABLE_ANIMATIONS,
  SETTING_DISABLE_MUSIC,
  SETTING_DISABLE_SOUNDS,
  SETTING_EDUCATION_MODE,
  SETTING_INVERT_DIRECTION,
  SETTING_START_SCREEN,
} from "./store";
import { ResourceType, resourceNames, resourceTypes } from "./worldParamsSlice";
import { generateWeather } from "../utils/generators";
import { WeatherCondition } from "./worldParamsSlice";
import { generateUUID } from "three/src/math/MathUtils.js";

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

export interface LogWithIdT {
  id: string;
  text: string;
}

export interface GameStateSlice {
  disableAnimations: boolean;
  disableSounds: boolean;
  disableMusic: boolean;
  educationMode: boolean;
  toggleEducationMode: () => void;

  invertDirection: boolean;

  showSettingsModal: boolean;
  showAboutModal: boolean;
  showArtifactsModal: boolean;
  showMapModal: boolean;
  toggleModal: (modalName: ModalName) => void;

  startToLoadFiles: boolean;
  loadingProgress: number;

  educationalStepIndex: number;
  increaseEducationalStepIndex: () => void;

  startScreen: boolean;
  firstStart: boolean;
  terrainLoading: boolean;
  terrainAppearing: boolean;
  animationFirstStage: boolean;
  startStageFinished: boolean;

  resetValues: boolean;

  autoPilot: boolean;

  currentOffset: Offset;
  selectedResource: ResourceType;
  selectedChunk: ChunkType;
  currentLocation: ChunkType;
  moveDirection: Offset;
  droneVectorMovement: Offset;
  droneMoveAngle: number;
  dynamicSpeed: number;
  playerPoints: number;
  decreasePlayerPoints: (points: number) => void;

  locationsHistory: ChunkType[];
  addLocationToHistory: (location: ChunkType) => void;

  updateResourcesAndPoints: () => void;
  collectedResources: CollectedResources;
  message: string;
  addNewMessage: (message: string) => void;
  logs: LogWithIdT[];
  eventsLog: LogWithIdT[];
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

export type ModalName =
  | "showSettingsModal"
  | "showAboutModal"
  | "showArtifactsModal"
  | "showMapModal";

export const movementDirections = [
  { x: -1, y: 0, label: "a" },
  { x: 0, y: -1, label: "w" },
  { x: 0, y: 1, label: "s" },
  { x: 1, y: 0, label: "d" },
];

export const createGameStateSlice: StateCreator<
  GameStoreState,
  [],
  [],
  GameStateSlice
> = (set, get) => ({
  disableAnimations:
    localStorage.getItem(SETTING_DISABLE_ANIMATIONS) === "true",
  disableSounds: localStorage.getItem(SETTING_DISABLE_SOUNDS) === "true",
  disableMusic: localStorage.getItem(SETTING_DISABLE_MUSIC) === "true",

  educationMode: localStorage.getItem(SETTING_EDUCATION_MODE) === "true",
  toggleEducationMode: () => {
    const newValue = !get().educationMode;
    set({ educationMode: newValue });
    localStorage.setItem(SETTING_EDUCATION_MODE, newValue.toString());
    if (!newValue) {
      set({ educationalStepIndex: 0 });
    }
  },

  invertDirection: localStorage.getItem(SETTING_INVERT_DIRECTION) === "true",
  startScreen: localStorage.getItem(SETTING_START_SCREEN) === "true",

  showSettingsModal: false,
  showAboutModal: false,
  showArtifactsModal: false,
  showMapModal: false,

  toggleModal: (modalName: ModalName) => {
    set((state) => {
      return { [modalName]: !state[modalName] };
    });
  },

  educationalStepIndex: 0,
  increaseEducationalStepIndex: () => {
    set((state) => {
      return { educationalStepIndex: state.educationalStepIndex + 1 };
    });
  },

  startToLoadFiles: false,
  loadingProgress: 0,

  firstStart: false,
  terrainLoading: true,
  terrainAppearing: false,
  animationFirstStage: false,
  startStageFinished: false,

  resetValues: false,

  autoPilot: false,

  currentOffset: { x: 0, y: 0 },
  selectedResource: "Water",
  selectedChunk: { x: 0, y: 0 },
  currentLocation: { x: 0, y: 0 },
  moveDirection: { x: 0, y: -1 },
  droneVectorMovement: { x: 0, y: 0 },
  droneMoveAngle: 0,
  dynamicSpeed: 1,

  locationsHistory: [
    {
      x: 0,
      y: 0,
    },
  ],
  addLocationToHistory: (location: ChunkType) => {
    set((state) => {
      if (
        !state.locationsHistory.some(
          (loc) => loc.x === location.x && loc.y === location.y,
        )
      ) {
        return { locationsHistory: [...state.locationsHistory, location] };
      }
      return state;
    });
  },

  playerPoints: DEV_MODE ? 20000 : 1000,

  decreasePlayerPoints: (points: number) => {
    set((state) => {
      return { playerPoints: state.playerPoints - points };
    });
  },

  collectedResources: {
    [resourceNames[0]]: 0,
    [resourceNames[1]]: 0,
    [resourceNames[2]]: 0,
    [resourceNames[3]]: 0,
  },

  updateResourcesAndPoints: () => {
    const {
      beacons,
      collectedResources,
      playerPoints,
      canPlaceBeacon,
      costs,
      addEventLog,
      dynamicSpeed,
      animationFirstStage,
      mapAnimationState,
    } = get();

    const { mapParams } = get();

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

    const combinedSpeed = dynamicSpeed * mapParams.speed;

    if (combinedSpeed > 1) {
      newPlayerPoints -=
        dynamicSpeed * mapParams.speed * costs.increaseSpeed.value;
      addEventLog(
        `High Speed. -${dynamicSpeed * mapParams.speed * costs.increaseSpeed.value} energy`,
      );
    }

    if (
      (mapParams.width > 100 || mapParams.depth > 100) &&
      animationFirstStage &&
      mapAnimationState === "idle"
    ) {
      const extraMapSize = mapParams.width - 100 + (mapParams.depth - 100);
      const extraCosts = Math.round(extraMapSize * costs.increaseMapSize.value);
      newPlayerPoints -= extraCosts;
      addEventLog(`Extra Map Scan. -${extraCosts} energy`);
    }

    if (canPlaceBeacon) {
      if (newPlayerPoints >= costs.scanning.value) {
        newPlayerPoints -= costs.scanning.value;
        addEventLog(`Scanning. -${costs.scanning.value} energy`);
      }
    }

    set({
      collectedResources: newCollectedResources,
      playerPoints: Math.max(newPlayerPoints, 0),
      mapParams: {
        ...mapParams,
        speed: playerPoints > 0 ? mapParams.speed : 1,
      },
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
    increaseSpeed: { name: "Extra speed", value: 5, valueAlt: "x" },
    increaseMapSize: { name: "Extra map size", value: 2, valueAlt: "x" },
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
    const uniqueLog: LogWithIdT = {
      id: generateUUID(),
      text: log,
    };
    set((state) => {
      const updatedLogs = [uniqueLog, ...state.logs];
      if (updatedLogs.length > 10) {
        updatedLogs.pop();
      }
      return { logs: updatedLogs };
    });
  },
  addEventLog: (eventName) => {
    const uniqueLog: LogWithIdT = {
      id: generateUUID(),
      text: eventName,
    };
    set((state) => {
      const updatedEvents = [uniqueLog, ...state.eventsLog];
      if (updatedEvents.length > 5) {
        updatedEvents.pop();
      }
      return { eventsLog: updatedEvents };
    });
  },
});
