import { SliderWithInput } from "./uiLibrary";
import { useGameStore } from "../../../store/store";
import { BasicPanelWrapper } from "../BasicPanelWrapper";
import { useMemo } from "react";

export const SystemControls = () => {
  const updateMapParam = useGameStore((state) => state.updateMapParam);
  const mapWidth = useGameStore((state) => state.mapParams.width);
  const mapDepth = useGameStore((state) => state.mapParams.depth);
  const mapResolution = useGameStore((state) => state.mapParams.resolution);
  const mapSpeed = useGameStore((state) => state.mapParams.speed);

  // width 200 and depth 200 is limit mapResolution to 3 minimum

  const mapParams = useMemo(() => {
    const mapWidthParams = {
      min: 1,
      max: 200,
    };

    const mapDepthParams = {
      min: 1,
      max: 200,
    };

    const mapResolutionParams = {
      min: 2,
      max: 7,
    };

    // if (mapWidth > 100 && mapDepth > 100 && mapResolution < 3) {
    //   mapResolutionParams.min = 3;
    // } else if (mapResolution === 2 && mapWidth > 100 && mapDepth > 100) {
    //   mapWidthParams.max = 100;
    //   mapDepthParams.max = 100;
    // } else if (mapResolution === 3 && mapWidth === 100 && mapDepth === 100) {
    //   mapWidthParams.max = 200;
    //   mapDepthParams.max = 200;
    // } else if (mapResolution === 3 && mapWidth > 100 && mapDepth > 100) {
    //   mapWidthParams.max = 100;
    //   mapDepthParams.max = 100;
    // }

    return { mapWidthParams, mapDepthParams, mapResolutionParams };
  }, [mapWidth, mapDepth, mapResolution]);

  const opacity = useGameStore(
    (state) => state.uiPanelsState.systemControlsPanel.opacity,
  );

  return (
    <BasicPanelWrapper titleText="System Controls" opacity={opacity}>
      <div className="w-full space-y-1 bg-black/20 px-1 mb-2 divide-y divide-uilines rounded-md">
        <div className="w-full space-y-1 pt-1 pb-1">
          <SliderWithInput
            label="Map Width"
            value={mapWidth}
            max={mapParams.mapWidthParams.max}
            onUpdate={(e) => updateMapParam("width", e)}
          />
          <SliderWithInput
            label="Map Depth"
            value={mapDepth}
            max={mapParams.mapDepthParams.max}
            onUpdate={(e) => updateMapParam("depth", e)}
          />
          <SliderWithInput
            label="Resolution"
            value={mapResolution}
            min={mapParams.mapResolutionParams.min}
            max={mapParams.mapResolutionParams.max}
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
        {/* <div className="space-y-1 pt-2">
          <CheckBox
            label="Disable Animations"
            value={disableAnimations}
            onUpdate={() =>
              updateVariableInLocalStorage(
                SETTING_DISABLE_ANIMATIONS,
                !disableAnimations,
              )
            }
          />
        </div> */}
      </div>
    </BasicPanelWrapper>
  );
};
