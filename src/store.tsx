// store.js
import { Color } from "three";
import create from "zustand";

export const minLevel = -10;
export const maxLevel = 100;

export const terrainTypes = {
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

const useGamaStore = create((set) => ({
	firstStart: false,
	loading: true,


  // const gridConfig = useControls({
  //   chunkSize: { value: 1, min: 1, max: 200 },
  //   subGrids: { value: 5, min: 1, max: 20, step: 1 },
  //   lineWidth: { value: 0.2, min: 0.01, max: 0.5 },
  //   gridColor: '#ff0000',
  //   subGridColor: '#ffffff',
  // });

	gridConfig: {
		chunkSize: 1,
		subGrids: 5,
		lineWidth: 0.2,
		gridColor: "#ff0000",
		subGridColor: "#ffffff",
	},

	mapParams: {
		width: 100,
		depth: 100,
		resolution: 3,
		scale: 50,
		seed: "42",
		offsetX: 0,
		offsetY: 0,
		speed: 0.1,
	},
	currentOffset: { x: 0, y: 0 },
  showResources: false,
  selectedResource: "",
	selectedChunk: { x: 0, y: 0 },
  currentLocation: { x: 0, y: 0 },
	moveDirection: { x: 0, y: -1 },
  dynamicSpeed: 1,
  beacons: [],
  playerPoints: 1000,
	collectedResources: {
		r1: 0,
		r2: 0,
		r3: 0,
		r4: 0,
	},
	planetParams: {

	},
  message: "",
	scanRadius: 30,
	canPlaceBeacon: false,
	activePosition: { x: 0, y: 0 },
  toggleShowResources: () => set((state) => ({ showResources: !state.showResources })),


	replacePropWithXY: (name, value) => {
		set((state) => ({ [name]: { x: value.x, y: value.y } }));
	}


  // selectResource: (resource) => set({ selectedResource: resource }),
}));

export default useGamaStore;
