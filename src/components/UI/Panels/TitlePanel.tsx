// import { useMemo } from "react";
import { useGameStore } from "../../../store/store";

export const TitlePanel = () => {
  const uiPanelsState = useGameStore((state) => state.uiPanelsState);
  const worldParams = useGameStore((state) => state.worldParams);
  // const terrainColors = useGameStore((state) => state.terrainColors);

  // const parseColors = useMemo(() => {
  //   const colors = Object.keys(terrainColors).map((key) => {
  //     return {
  //       color: [terrainColors[key].color.r, terrainColors[key].color.g, terrainColors[key].color.b],
  //     };
  //   });

  //   colors.pop();

  //   return colors;
  // }, [terrainColors]);

  return (
    <div
      className="w-[20rem] h-16 border text-xs text-uitext flex flex-wrap justify-end items-end px-1 bg-neutral-900 border-uilines"
      style={{ opacity: uiPanelsState.titlePanel.opacity }}
    >
      {/* <div className=" flex flex-wrap space-x-1">
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
      </div> */}
      <div className="h-fit w-full px-1 content-end orbitron text-2xl text-end uppercase leading-6 text-uitext">
        {`Planet-${worldParams.seed.value}`}
      </div>
    </div>
  );
};
