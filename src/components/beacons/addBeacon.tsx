import { useCallback } from "react";
import useGamaStore, { BeaconType, ResourceType } from "../../store";




export const useProcessBeacons = () => {

  // const currentChunk = useGamaStore.getState().currentLocation;
  const beacons = useGamaStore((state) => state.beacons);

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
  
    const minDistance = 10;
  
    const isWithinRadius = chunkBeacons.some((beacon: { x: number; z: number; }) => {
      const dx = position.x - beacon.x;
      const dz = position.z - beacon.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      return distance < minDistance;
    });
  
    if (isWithinRadius) {
      useGamaStore.setState({ message: "Cannot place beacon too close to another beacon." });
      return;
    }
  
    // console.log("Beacons in chunk:", [beacon.chunk.x, beacon.chunk.y, currentChunk.x, currentChunk.y]);
    if (chunkBeacons.length >= 2) {
      useGamaStore.setState({ message: "Maximum beacons placed in this chunk." });
      // console.log("Maximum beacons placed in this chunk.");
      return;
    }
  
    useGamaStore.setState((state: { beacons: BeaconType[]; }) => {
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
        },
      ];
      console.log("Adding beacon:", {newBeacons, position, currentChunk});
      return { beacons: newBeacons };
    });
  }, [beacons]);

  return { addBeacon };

};
