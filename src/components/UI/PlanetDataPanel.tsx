import { useGameStore } from "../../store";
import { BasicPanelWrapper } from "./BasicPanelWrapper";

export const PlanetDataPanel = () => {
  const opacity = useGameStore((state) => state.uiPanelsState.planetPanel.opacity);
  const worldParams = useGameStore((state) => state.worldParams);
  const weatherCondition = useGameStore((state) => state.weatherCondition);

  return (
    <BasicPanelWrapper titleText="Planet:" opacity={opacity}>
      {Object.entries(worldParams)
        .filter(([key, value]) => value !== "" && key !== "weatherCondition")
        .map(([key, value]) => (
          <div key={key}>
            {key}: {value}
          </div>
        ))}
      <p>Weather: {weatherCondition}</p>
    </BasicPanelWrapper>
  );
};
