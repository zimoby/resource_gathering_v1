import { useMemo } from "react";
import { useGameStore } from "../../../store/store";
import {
  WorldNumberParamT,
  WorldParamsType,
  WorldStringParamT,
} from "../../../store/worldParamsSlice";
import { BasicPanelWrapper } from "../BasicPanelWrapper";

interface ParamProps {
  name: string;
  value: string | number;
  min?: number;
  max?: number;
}

const ParamComponent: React.FC<ParamProps> = ({ name, value, min, max }) => {
  const isNumber = typeof value === "number";
  const isDanger =
    isNumber &&
    min !== undefined &&
    max !== undefined &&
    (value >= max || value <= min);

  return (
    <div
      className="flex w-full list-selecting justify-between"
      onClick={() =>
        useGameStore.setState({ message: `Planet: ${name}: ${value}` })
      }
    >
      <div>
        {name}: {value}
      </div>
      {isDanger && (
        <div className="text-2xs uppercase border border-uilines px-1">
          danger
        </div>
      )}
    </div>
  );
};

export const PlanetDataPanel = () => {
  const opacity = useGameStore(
    (state) => state.uiPanelsState.planetPanel.opacity,
  );
  const worldParams = useGameStore((state) => state.worldParams);
  const weatherCondition = useGameStore((state) => state.weatherCondition);
  const terrainColors = useGameStore((state) => state.terrainColors);

  const parseColors = useMemo(() => {
    const colors = Object.keys(terrainColors).map((key) => {
      return {
        color: [
          terrainColors[key].color.r,
          terrainColors[key].color.g,
          terrainColors[key].color.b,
        ],
      };
    });

    colors.pop();

    return colors;
  }, [terrainColors]);

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
    <BasicPanelWrapper
      augUi=""
      styles="border border-uilines"
      titleText="Planet:"
      opacity={opacity}
    >
      <div className="w-full">
        {paramNames.map((paramName) => {
          const param = worldParams[paramName] as
            | WorldNumberParamT
            | WorldStringParamT;
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
        <div className="list-selecting flex flex-row justify-start">
          <p className="">Ground:</p>
          <div className=" flex flex-row ml-2 space-x-1 justify-center items-center">
            {parseColors.map((color, index) => {
              return (
                <div
                  key={index}
                  className="size-3 rounded-full "
                  style={{
                    backgroundColor: `rgb(${color.color[0] * 255} ${color.color[1] * 255} ${
                      color.color[2] * 255
                    })`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </BasicPanelWrapper>
  );
};
