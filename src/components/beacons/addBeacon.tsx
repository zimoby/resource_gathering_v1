import useGamaStore from "../../store";




export const addBeacon = ({
  position, resource, currentChunk,
}) => {
  // const currentChunk = useGamaStore.getState().currentLocation;
  const beacons = useGamaStore.getState().beacons;
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

  useGamaStore.setState((state: { beacons: any; }) => {
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
    return { beacons: newBeacons };
  });

  // console.log("Beacons:", beacons);
};
