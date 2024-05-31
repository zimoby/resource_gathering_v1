import { useEffect } from "react";
import { useGameStore } from "../../../store/store";
import { PlanetChunks } from "../Elements/planetChunks";

export const MapModal = () => {
  const showMapModal = useGameStore((state) => state.showMapModal);
  const updateStoreProperty = useGameStore(
    (state) => state.updateStoreProperty,
  );

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        updateStoreProperty("showMapModal;", false);
      }
    };

    if (showMapModal) {
      window.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [showMapModal, updateStoreProperty]);

  return (
    <div
      className="fixed w-full h-full flex justify-center items-center z-50 bg-black/50"
      style={{ display: showMapModal ? "flex" : "none" }}
    >
      <div
        className="relative bg-black/80 w-96 h-1/2 flex flex-col border border-uilines aug-border-yellow-500"
        data-augmented-ui="border tl-2-clip-x br-2-clip-x --aug-border-bg"
      >
        <div className="flex justify-end items-center">
          <div
            className="flex justify-center items-center size-8 text-uitext cursor-pointer hover:bg-uilines hover:text-neutral-900"
            onClick={() => updateStoreProperty("showMapModal", false)}
          >
            <div className="text-4xl rotate-45 text-center">+</div>
          </div>
        </div>
        <div className="orbitron w-full h-8 flex justify-center bg-uilines items-center text-neutral-900 text-2xl">
          {`Map`}
        </div>
        <div className="w-full h-full flex justify-center items-center">
          <PlanetChunks size={21} hideControls={true} />
        </div>
      </div>
    </div>
  );
};
