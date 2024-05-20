import { useCallback } from "react";
import { useGameStore } from "../../store";
import { BeaconType, ResourceType } from "../../store/worldParamsSlice";

const minDistance = 20;


export const useProcessBeacons = () => {
  const addLog = useGameStore((state) => state.addLog);
  // const currentChunk = useGameStore.getState().currentLocation;
  const beacons = useGameStore((state) => state.beacons);
  const weatherCondition = useGameStore((state) => state.weatherCondition);

  const addBeacon = useCallback(({
    position, resource, currentChunk
  }: {
    position: { x: number; y: number; z: number; };
    resource: ResourceType;
    currentChunk: { x: number; y: number; };
  }) => {

    const chunkBeacons = beacons.filter(
      (beacon: { chunkX: number; chunkY: number; }) => beacon.chunkX === currentChunk.x && beacon.chunkY === currentChunk.y
    );
  
  
    const isWithinRadius = chunkBeacons.some((beacon: { x: number; z: number; }) => {
      const dx = position.x - beacon.x;
      const dz = position.z - beacon.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      return distance < minDistance;
    });
  
    if (isWithinRadius) {
      useGameStore.setState({ message: "Cannot place beacon too close to another beacon." });
      return;
    }
  
    // console.log("Beacons in chunk:", [beacon.chunk.x, beacon.chunk.y, currentChunk.x, currentChunk.y]);
    if (chunkBeacons.length >= 2) {
      useGameStore.setState({ message: "Maximum beacons placed in this chunk." });
      // console.log("Maximum beacons placed in this chunk.");
      return;
    }

    addLog(`Beacon placed at ${currentChunk.x}, ${currentChunk.y}`);
  
    useGameStore.setState((state: { beacons: BeaconType[]; }) => {
      // console.log("Adding beacon:", {x : position.x.toFixed(3), resource, currentChunk});
      const newBeacons = [
        ...state.beacons,
        {
          x: Number(position.x.toFixed(3)),
          y: Number(position.y.toFixed(3)),
          z: Number(position.z.toFixed(3)),
          resource,
          chunkX: currentChunk.x,
          chunkY: currentChunk.y,
          visible: true,
          id: Math.random().toString(36).substr(2, 9),
        },
      ];
      // console.log("Adding beacon:", {newBeacons, position, currentChunk});
      return { beacons: newBeacons };
    });
  }, [addLog, beacons]);

  const destroyBeacons = useCallback(() => {
    if (weatherCondition === "severe") {
      const destroyPercentage = 0.2;
      const numBeaconsToDestroy = Math.floor(beacons.length * destroyPercentage);
  
      if (numBeaconsToDestroy > 0) {
        const destroyedBeacons: BeaconType[] = [];
  
        for (let i = 0; i < numBeaconsToDestroy; i++) {
          const randomIndex = Math.floor(Math.random() * beacons.length);
          const destroyedBeacon = beacons[randomIndex];
          destroyedBeacons.push(destroyedBeacon);
          beacons.splice(randomIndex, 1);
        }
  
        useGameStore.setState((state) => {
          const newBeacons = state.beacons.filter(
            (beacon) => !destroyedBeacons.includes(beacon)
          );
          return { beacons: newBeacons };
        });
  
        useGameStore.setState({
          message: `Destroyed ${numBeaconsToDestroy} beacons due to severe weather.`,
        });
        addLog(`Destroyed ${numBeaconsToDestroy} beacons due to severe weather.`);
      }
    }
  }, [addLog, beacons, weatherCondition]);
  
  return { addBeacon, destroyBeacons };

};