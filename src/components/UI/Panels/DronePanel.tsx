import { useGameStore } from "../../../store/store";
import { BasicPanelWrapper } from "../BasicPanelWrapper";

export const DronePanel = () => {
  const opacity = useGameStore(
    (state) => state.uiPanelsState.supportPanels.opacity,
  );
  const autoPilot = useGameStore((state) => state.autoPilot);

  return (
    <BasicPanelWrapper titleText="Drone:" styles="" opacity={opacity}>
      <div className="flex flex-col items-center">
        <button
          className={`flex justify-center items-center orbitron px-2 py-1 border uppercase border-uilines mx-3 my-5 text-sm ${autoPilot ? "bg-uilines text-neutral-900" : "text-uitext"}`}
          onClick={() => useGameStore.setState({ autoPilot: !autoPilot })}
        >
          Autopilot
        </button>
      </div>
    </BasicPanelWrapper>
  );
};
