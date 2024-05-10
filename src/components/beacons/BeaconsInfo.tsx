import { useMemo } from "react";
import useGamaStore from "../../store";
import { convertChunkCoordinateToName } from "../../functions/functions";
import { BasicPanelWrapper } from "../UI/uiInfo";


export const BeaconsInfo = () => {
    const beacons = useGamaStore((state) => state.beacons);
    const memoizedBeacons = useMemo(() => {

      if (beacons.length === 0) return (<></>);

      return (
        <BasicPanelWrapper titleText="Beacons">
          <div className="scrollbar">
            {beacons.slice(0, 100).map((beacon, index) => (
              <div key={index}>
                {convertChunkCoordinateToName({x: beacon.chunkX, y: beacon.chunkY }) + ": " + beacon.resource}
              </div>
            ))}
          </div>
        </BasicPanelWrapper>
      )}, [beacons]);

    return memoizedBeacons;
}
