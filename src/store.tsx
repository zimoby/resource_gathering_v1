import { create } from "zustand";
import { WorldParamsSlice, createWorldParamsSlice } from "./store/worldParamsSlice";
import { UiPanelsStateSlice, createUiPanelsStateSlice } from "./store/uiPanelsStateSlice";
import { MapParamsSlice, createMapParamsSlice } from "./store/mapParamsSlice";
import { GameStateSlice, createGameStateSlice } from "./store/gameStateSlice";

export const DEV_MODE = import.meta.env.VITE_APP_MODE === "development";

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