// store.js
import { Color } from "three";
import create from "zustand";

export const terrainTypes = {
  water: {
    color: new Color(0x0000ff), // blue
    level: -9,
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
    color: new Color(0x8b4513), // brown
  },
};

export const resourceTypes = {
  r1: {
    color: new Color(0xffffff), // white
    threshold: 0.1,
    score: 10,
  },
  r2: {
    color: new Color(0xffa500), // orange
    threshold: 0.2,
    score: 7,
  },
  r3: {
    color: new Color(0x800080), // purple
    threshold: 0.4,
    score: 5,
  },
  r4: {
    color: new Color(0xff4080), // pink
    threshold: 1,
    score: 1,
  },
};

const useStore = create((set) => ({
  showResources: false,
  selectedResource: "",
  currentLocation: { x: 0, y: 0 },
  beacons: [],
  playerPoints: 0,
  message: "",

	canPlaceBeacon: false,

  toggleShowResources: () => set((state) => ({ showResources: !state.showResources })),

  // selectResource: (resource) => set({ selectedResource: resource }),
}));

export default useStore;
