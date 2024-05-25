import { useGameStore } from "../../../store/store";
import { WorldNumberParamT, WorldParamsType, WorldStringParamT } from "../../../store/worldParamsSlice";
import { BasicPanelWrapper } from "../BasicPanelWrapper";

interface ParamProps {
  name: string;
  value: string | number;
  min?: number;
  max?: number;
}

const ParamComponent: React.FC<ParamProps> = ({ name, value, min, max }) => {
  const isNumber = typeof value === "number";
  const isDanger = isNumber && min !== undefined && max !== undefined && (value >= max || value <= min);

  return (
    <div
      className="flex w-full list-selecting justify-between"
      onClick={() => useGameStore.setState({ message: `Planet: ${name}: ${value}` })}
    >
      <div>
        {name}: {value}
      </div>
      {isDanger && <div className="text-2xs uppercase border border-uilines px-1">danger</div>}
    </div>
  );
};

export const PlanetDataPanel = () => {
  const opacity = useGameStore((state) => state.uiPanelsState.planetPanel.opacity);
  const worldParams = useGameStore((state) => state.worldParams);
  const weatherCondition = useGameStore((state) => state.weatherCondition);

  const paramNames: (keyof WorldParamsType)[] = [
    "seed",
    "worldState",
    "temperature",
    "humidity",
    "windSpeed",
    "pollution",
    "radiation",
  ];
  
  return (
    <BasicPanelWrapper augUi="" styles="border border-uilines" titleText="Planet:" opacity={opacity}>
      <div className="w-full">
        {paramNames.map((paramName) => {
          const param = worldParams[paramName] as WorldNumberParamT | WorldStringParamT;
          return (
            <ParamComponent
              key={paramName}
              name={param.name}
              value={param.value}
              min={(param as WorldNumberParamT).min}
              max={(param as WorldNumberParamT).max}
            />
          );
        })}
        <p className="list-selecting">Weather: {weatherCondition}</p>
      </div>
    </BasicPanelWrapper>
  );
};