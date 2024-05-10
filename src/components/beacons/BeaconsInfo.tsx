import { useMemo } from "react";
import useGamaStore from "../../store";
import { convertChunkCoordinateToName } from "../../functions/functions";


export const BeaconsInfo = () => {
    const beacons = useGamaStore((state) => state.beacons);
    const memoizedBeacons = useMemo(() => {

      return (
        <div className="scrollbar z-50 p-1 h-fit max-h-56 w-fit text-left m-2 text-xs fixed bottom-0 right-0 rounded-md border border-white/80">
          {beacons.slice(0, 100).map((beacon, index) => (
            <div key={index}>
              {convertChunkCoordinateToName({x: beacon.chunkX, y: beacon.chunkY }) + ": " + beacon.resource}
            </div>
          ))}
        </div>
      )}, [beacons]);

    return memoizedBeacons;
}
