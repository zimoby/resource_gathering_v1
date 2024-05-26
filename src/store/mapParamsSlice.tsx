import { StateCreator } from "zustand";
import { GameStoreState } from "./store";

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

export interface MapParamsSlice {
  gridConfig: GridConfig;
  mapParams: MapParams;
  showResources: boolean;
  mapAnimationState: "idle" | "shrinking" | "enlarging";
  setMapAnimationState: (state: "idle" | "shrinking" | "enlarging") => void;
  updateMapSize: (value: number) => void;
  updateMapParam: (paramName: string, value: unknown) => void;
  toggleShowResources: () => void;
}

export const createMapParamsSlice: StateCreator<
  GameStoreState,
  [],
  [],
  MapParamsSlice
> = (set) => ({
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
    speed: 1,
  },
  showResources: false,
  mapAnimationState: "idle",
  setMapAnimationState: (state) => set({ mapAnimationState: state }),
  updateMapSize: (value) => {
    set((state) => ({
      mapParams: { ...state.mapParams, width: value, depth: value },
    }));
  },
  updateMapParam: (paramName, value) => {
    set((state) => ({
      mapParams: { ...state.mapParams, [paramName]: value },
    }));
  },
  toggleShowResources: () =>
    set((state) => ({ showResources: !state.showResources })),
});
