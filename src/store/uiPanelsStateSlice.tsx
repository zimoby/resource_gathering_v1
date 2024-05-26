import { StateCreator } from "zustand";
import { GameStoreState } from "./store";

interface UiPanelsStateType {
  opacity: number;
}

export interface UiPanelsStateSlice {
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
    collectedArtifactsPanel: UiPanelsStateType;
    costsPanel: UiPanelsStateType;
    emptyPanel: UiPanelsStateType;
    supportPanels: UiPanelsStateType;
    settingsButton: UiPanelsStateType;
    newWorldButton: UiPanelsStateType;
  };
  updatePanelOpacity: (panelName: PanelNamesT, value: number) => void;
  soloPanelOpacity: (panelName: PanelNamesT) => void;
  resetPanelsOpacity: () => void;
}

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
  | "eventsPanel"
  | "collectedArtifactsPanel"
  | "costsPanel"
  | "emptyPanel"
  | "supportPanels"
  | "settingsButton"
  | "newWorldButton";

export const createUiPanelsStateSlice: StateCreator<
  GameStoreState,
  [],
  [],
  UiPanelsStateSlice
> = (set) => ({
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
    collectedArtifactsPanel: { opacity: 1 },
    costsPanel: { opacity: 1 },
    emptyPanel: { opacity: 1 },
    supportPanels: { opacity: 1 },
    settingsButton: { opacity: 1 },
    newWorldButton: { opacity: 1 },
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
      const newPanelsState = Object.keys(state.uiPanelsState).reduce(
        (acc, key) => {
          acc[key as keyof typeof state.uiPanelsState] = { opacity: 0.1 };
          return acc;
        },
        {} as typeof state.uiPanelsState,
      );
      newPanelsState[panelName] = { opacity: 1 };
      return {
        uiPanelsState: newPanelsState,
      };
    });
  },
  resetPanelsOpacity: () => {
    set((state) => {
      const newPanelsState = Object.keys(state.uiPanelsState).reduce(
        (acc, key) => {
          acc[key as keyof typeof state.uiPanelsState] = { opacity: 1 };
          return acc;
        },
        {} as typeof state.uiPanelsState,
      );
      return {
        uiPanelsState: newPanelsState,
      };
    });
  },
});
