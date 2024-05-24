import { SliderWithInput, CheckBox } from "./uiLibrary";
import { useGameStore } from "../../../store/store";
import { BasicPanelWrapper } from "../BasicPanelWrapper";

export const SystemControls = () => {
  const updateMapParam = useGameStore((state) => state.updateMapParam);
  const mapWidth = useGameStore((state) => state.mapParams.width);
  const mapDepth = useGameStore((state) => state.mapParams.depth);
  const mapResolution = useGameStore((state) => state.mapParams.resolution);
  const mapSpeed = useGameStore((state) => state.mapParams.speed);
  const disableAnimations = useGameStore((state) => state.disableAnimations);
  const updateDisableAnimationsInStorage = useGameStore(
    (state) => state.updateDisableAnimationsInStorage
  );

  const opacity = useGameStore((state) => state.uiPanelsState.systemControlsPanel.opacity);

  return (
    <BasicPanelWrapper titleText="System Controls" opacity={opacity}>
      <div className="w-full space-y-1 bg-black/20 px-1 mb-2 divide-y divide-uilines rounded-md">
        <div className="w-full space-y-1 pt-1 pb-1">
          <SliderWithInput
            label="Map Width"
            value={mapWidth}
            max={200}
            onUpdate={(e) => updateMapParam("width", e)}
          />
          <SliderWithInput
            label="Map Depth"
            value={mapDepth}
            max={200}
            onUpdate={(e) => updateMapParam("depth", e)}
          />
          <SliderWithInput
            label="Resolution"
            value={mapResolution}
            min={2}
            max={7}
            onUpdate={(e) => updateMapParam("resolution", e)}
          />
          <SliderWithInput
            label="Speed"
            value={mapSpeed}
            min={0}
            max={5}
            step={0.1}
            onUpdate={(e) => updateMapParam("speed", e)}
          />
        </div>
        <div className="space-y-1 pt-2">
          <CheckBox
            label="Disable Animations"
            value={disableAnimations}
            onUpdate={() => updateDisableAnimationsInStorage(!disableAnimations)}
          />
        </div>
      </div>
    </BasicPanelWrapper>
  );
};
