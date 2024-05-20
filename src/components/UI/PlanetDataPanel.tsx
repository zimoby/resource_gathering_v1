import { useGameStore } from "../../store";
import { BasicPanelWrapper } from "./BasicPanelWrapper";

export const PlanetDataPanel = () => {
  const opacity = useGameStore((state) => state.uiPanelsState.planetPanel.opacity);
  const worldParams = useGameStore((state) => state.worldParams);
  const weatherCondition = useGameStore((state) => state.weatherCondition);

  return (
    <BasicPanelWrapper titleText="Planet:" opacity={opacity}>
      <div >
        {Object.entries(worldParams)
          .filter(([key, value]) => value !== "" && key !== "weatherCondition")
          .map(([key, value]) => (
            <div className="list-selecting" key={key}
              onClick={() => useGameStore.setState({ message: `Planet: ${key}: ${value}` })}
            >
              {key}: {value}
            </div>
          ))}
        <p className="list-selecting">Weather: {weatherCondition}</p>
      </div>
    </BasicPanelWrapper>
  );
};
