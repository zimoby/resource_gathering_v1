import { FlickeringHtmlEffect } from "../../../effects/AppearingUiEffectWrapper";
import { useGameStore } from "../../../store/store";

export const SimpleWarningLines = ({ classes, size = "" }: { classes?: string; size?: string }) => {
  return (
    <div
      className={`warning-sign3 ${classes} flex ${
        size === "" ? "flex-grow" : size
      } aug-border-yellow-500`}
      data-augmented-ui={`border br-clip-x --aug-border-bg`}
    />
  );
};

export const WarningBlock = () => {
  const weather = useGameStore((state) => state.weatherCondition);

  return (
    <>
      {weather === "severe" && (
        <FlickeringHtmlEffect>
          <div
            className="fixed top-0 w-fit h-14 flex flex-row z-20 animate-pulse aug-border-yellow-500"
            style={{
              top: "calc(-50vh + 90px)",
              left: "-150px",
            }}
            data-augmented-ui="border bl-clip-x br-clip-x --aug-border-bg"
          >
            <div className="relative w-fit h-full flex flex-row">
              <div className="absolute z-30 w-full h-full flex justify-center items-center ">
                <div
                  className="text-white text-center text-sm  orbitron bg-neutral-900 uppercase px-6 py-1 aug-border-yellow-500"
                  data-augmented-ui="border bl-clip br-clip --aug-border-bg"
                >
                  danger weather
                </div>
              </div>
              <WarningLines direction="xy" />
              <WarningLines direction="y" />
            </div>
          </div>
        </FlickeringHtmlEffect>
      )}
    </>
  );
};

const WarningLines = ({ direction }: { direction: string; width?: number }) => {
  let scaleInvert = "";
  if (direction === "xy") {
    scaleInvert = "-scale-x-100 -scale-y-100";
  } else if (direction === "y") {
    scaleInvert = "-scale-y-100";
  } else if (direction === "x") {
    scaleInvert = "-scale-x-100";
  }

  return (
    <div className={`w-[150px] h-full overflow-hidden bg-uilines ${scaleInvert}`}>
      <div
        className={`w-[300px] h-full flex flex-col justify-center items-center bg-repeat-x animate-linear`}
        style={{
          background:
            "repeating-linear-gradient(-45deg, transparent, transparent 20px, black 20px, black 40px)",
        }}
      />
    </div>
  );
};
