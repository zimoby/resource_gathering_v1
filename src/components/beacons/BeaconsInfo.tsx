import { useListAppearing } from "../../effects/ListAppearing";
import { ChunkType } from "../../store/gameStateSlice";
import { useGameStore } from "../../store/store";
import { convertChunkCoordinateToName } from "../../utils/functions";
import { BasicPanelWrapper } from "../UI/BasicPanelWrapper";
import { animated } from "@react-spring/web";

export const BeaconsInfo = () => {
  const beacons = useGameStore((state) => state.beacons);
  const opacity = useGameStore(
    (state) => state.uiPanelsState.beaconPanel.opacity,
  );
  const beaconsLimit = useGameStore((state) => state.beaconsLimit);
  const increaseBeconsLimit = useGameStore(
    (state) => state.increaseBeconsLimit,
  );

  const transitions = useListAppearing(beacons);

  return (
    <BasicPanelWrapper
      height="h-32"
      width="w-fit"
      titleText={`Beacons: ${beacons.length} / ${beaconsLimit}`}
      opacity={opacity}
    >
      <>
        {beacons.length === 0 && "No beacons"}
        {beacons.length === beaconsLimit && (
          <button
            className="w-48 px-2 mb-1 flex leading-4 justify-center items-center bg-uilines text-neutral-900 text-center h-5 hover:bg-orange-500 cursor-pointer"
            onClick={increaseBeconsLimit}
          >
            + Extend beacons limit +
          </button>
        )}
        {transitions((style, beacon, _, index) => (
          <animated.div
            key={beacon.id}
            style={style}
            className=""
            onClick={() =>
              useGameStore.setState({ message: `Beacon: ${beacon.resource}` })
            }
          >
            <div className="list-selecting pr-3">
              {index +
                1 +
                "." +
                convertChunkCoordinateToName({
                  x: beacon.chunkX,
                  y: beacon.chunkY,
                } as ChunkType) +
                ": " +
                beacon.resource}
            </div>
          </animated.div>
        ))}
        <div className="h-5" />
      </>
    </BasicPanelWrapper>
  );
};
