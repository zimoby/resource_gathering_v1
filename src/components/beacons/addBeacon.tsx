import useGamaStore from "../../store";




export const addBeacon = ({
  position, resource, currentChunk,
}) => {
  // const currentChunk = useGamaStore.getState().currentLocation;
  const beacons = useGamaStore.getState().beacons;
  const chunkBeacons = beacons.filter(
    (beacon: { chunk: { x: any; y: any; }; }) => beacon.chunk.x === currentChunk.x && beacon.chunk.y === currentChunk.y
  );

  const minDistance = 10;

  const isWithinRadius = chunkBeacons.some((beacon: { position: { x: number; z: number; }; }) => {
    const dx = position.x - beacon.position.x;
    const dz = position.z - beacon.position.z;
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
    const newBeacons = [
      ...state.beacons,
      {
        position: {
          x: position.x.toFixed(3),
          y: position.y.toFixed(3),
          z: position.z.toFixed(3),
        },
        resource,
        chunk: currentChunk,
        visible: true,
      },
    ];
    return { beacons: newBeacons };
  });

  // console.log("Beacons:", beacons);
};
