import { create } from "zustand";
import { WorldParamsSlice, createWorldParamsSlice } from "./worldParamsSlice";
import {
  UiPanelsStateSlice,
  createUiPanelsStateSlice,
} from "./uiPanelsStateSlice";
import { MapParamsSlice, createMapParamsSlice } from "./mapParamsSlice";
import { GameStateSlice, createGameStateSlice } from "./gameStateSlice";

export const DEV_MODE = import.meta.env.VITE_APP_MODE === "development";

export const SETTING_EDUCATION_MODE = "educationMode";
export const SETTING_DISABLE_ANIMATIONS = "disableAnimations";
export const SETTING_DISABLE_SOUNDS = "disableSounds";
export const SETTING_DISABLE_MUSIC = "disableMusic";
export const SETTING_INVERT_DIRECTION = "invertDirection";
export const SETTING_START_SCREEN = "startScreen";

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
