import { useGameStore } from "../../store";
import { convertChunkCoordinateToName } from "../../utils/functions";
import { BasicPanelWrapper } from "../UI/BasicPanelWrapper";
import { artefactAmount } from "../../store/worldParamsSlice";

export const ArtefactsInfo = () => {
  const artefacts = useGameStore((state) => state.artefacts);
  const opacity = useGameStore((state) => state.uiPanelsState.beaconPanel.opacity);

  return (
    <BasicPanelWrapper
      height="h-32"
      width="w-fit"
      titleText={`Artefacts: ${artefacts.length} / ${artefactAmount}`}
      opacity={opacity}
    >
      <>
        {/* <div className="h-auto min-h-12 max-h-36"> */}
        {/* <p className=" text-base">Amount: {artefacts.length} / {artefactAmount}</p> */}
        {artefacts.length === 0 && "No artefacts"}
        {artefacts.slice(0, 100).map((artefact, index) => (
          <div
            key={index}
            className="list-selecting"
            onClick={() => useGameStore.setState({ message: `Artefact: ${artefact.id}` })}
          >
            {index +
              1 +
              "." +
              convertChunkCoordinateToName({ x: artefact.chunkX, y: artefact.chunkY }) +
              ": " +
              artefact.chunkX +
              ":" +
              artefact.chunkY +
              ": " +
              Math.round(artefact.x) +
              ":" +
              Math.round(artefact.z)}
          </div>
        ))}
      </>
    </BasicPanelWrapper>
  );
};
