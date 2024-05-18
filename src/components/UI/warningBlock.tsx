import { useGameStore } from "../../store";

export const WarningBlock = () => {
  const weather = useGameStore((state) => state.weatherCondition);
  const blockSize = { x: 300, y: 100 };
  const sizeAnim = 120;

  return (
    <>
      {weather === "severe" && 
        <div
          className="fixed w-fit h-14 flex flex-row  z-20 top-24 animate-pulse"
          style={{ left: "calc(50vw - 125px)" }}
        >
          <div className="relative w-fit h-full flex flex-row">
            <div className="absolute z-30 w-full h-full flex justify-center items-center ">
              <div className="text-white text-center text-sm  orbitron bg-neutral-900 uppercase px-6 py-1">
                danger weather
              </div>
            </div>
            <WarningLines direction="xy" />
            <WarningLines direction="y" />
          </div>
          {/* <div className="bg-red-500 text-white text-xs p-1 rounded-md">
            <div className="text-center">Warning!</div>
            <div className="text-center">This is a test version</div>
            <div className="text-center">Some features may not work</div>
          </div> */}
        </div>
      }
    </>
  );
};

const WarningLines = ({ direction, width = 150 }: { direction: string; width?: number }) => {
  let scaleInvert = "";
  if (direction === "xy") {
    scaleInvert = "-scale-x-100 -scale-y-100";
  } else if (direction === "y") {
    scaleInvert = "-scale-y-100";
  }

  return (
    <div className={`w-[${width}px] h-full overflow-hidden bg-uilines ${scaleInvert}`}>
      <div
        className={`w-[${width * 2}px] h-full flex flex-col justify-center items-center  bg-repeat-x animate-linear`}
        style={{
          background: "repeating-linear-gradient(-45deg, transparent, transparent 20px, black 20px, black 40px)",
        }}
      />
    </div>
  );
};
