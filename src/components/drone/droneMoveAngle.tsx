import { useGameStore } from "../../store/store";

export const DroneMoveAngleUI = () => {
  const droneMoveAngle = useGameStore((state) => state.droneMoveAngle);
  const opacity = useGameStore(
    (state) => state.uiPanelsState.supportPanels.opacity,
  );

  return (
    <div
      className="relative size-16 mx-1 my-5 rounded-full bg-neutral-900 border border-uilines"
      style={{ opacity }}
    >
      <div className="absolute top-1/2 left-1/2 origin-left w-full border border-uilines opacity-20 bg-uilines -translate-x-1/2" />
      <div className="absolute top-1/2 left-1/2 origin-top w-full border border-uilines opacity-20 bg-uilines -translate-x-1/2 rotate-90" />
      <div
        className="absolute top-1/2 left-1/2 origin-left w-full border border-uilines bg-uilines"
        style={{
          transform: `rotate(${-droneMoveAngle}deg) translateX(-50%) scaleX(1)`,
        }}
      >
        <div className="absolute top-1/2 left-1/2 origin-top w-full border border-uilines opacity-50 bg-uilines -translate-x-1/2 translate-y-2 scale-75" />
        <div className="absolute top-1/2 left-1/2 origin-top w-full border border-uilines opacity-50 bg-uilines -translate-x-1/2 -translate-y-2 scale-75" />
      </div>
      <div className=" size-full rounded-full border border-uilines opacity-20 scale-125" />
      <p className=" font-mono size-full text-xs mt-2 text-center text-uitext">
        {-droneMoveAngle}°
      </p>
    </div>
  );
};
