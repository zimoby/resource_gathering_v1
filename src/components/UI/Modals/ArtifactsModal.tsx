import { useEffect, useMemo } from "react";
import { useGameStore } from "../../../store/store";
// import { useCheckVariableRender } from "../../../utils/functions";

export const ArtefactsModal = () => {
  const showArtifactsModal = useGameStore((state) => state.showArtifactsModal);
  const updateStoreProperty = useGameStore(
    (state) => state.updateStoreProperty,
  );
  const artifactsArray = useGameStore((state) => state.artifactsArray);

  // useCheckVariableRender(artifactsArray, "artifactsArray");

  const displayArtifactData = useMemo(() => {
    const artifactsNames = Object.values(artifactsArray).map(
      (artifact) => artifact.name,
    );

    const artifactsParams = Object.values(artifactsArray).map(
      (artifact) => artifact.params,
    );

    const uniteData = artifactsNames.map((name, index) => {
      return { name: name, params: artifactsParams[index] };
    });

    // console.log("uniteData", uniteData);

    return uniteData;
  }, [artifactsArray]);

  displayArtifactData;

  // console.log("artifactsArray", artifactsArray);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        updateStoreProperty("showArtifactsModal", false);
      }
    };

    if (showArtifactsModal) {
      window.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [showArtifactsModal, updateStoreProperty]);

  return (
    <div
      className="fixed w-full h-full flex justify-center items-center z-50 bg-black/50"
      style={{ display: showArtifactsModal ? "flex" : "none" }}
    >
      <div
        className="relative bg-black/80 w-96 h-1/2 flex flex-col border border-uilines aug-border-yellow-500"
        data-augmented-ui="border tl-2-clip-x br-2-clip-x --aug-border-bg"
      >
        {/* <div className="absolute bottom-1.5 left-1.5 size-5 border-l-uilines border-b-uilines border-b-2 border-l-2" /> */}
        <div className="flex justify-end items-center">
          <div
            className="flex justify-center items-center size-8 text-uitext cursor-pointer hover:bg-uilines hover:text-neutral-900"
            onClick={() => updateStoreProperty("showArtifactsModal", false)}
          >
            <div className="text-4xl rotate-45 text-center">+</div>
          </div>
        </div>
        <div className="orbitron w-full h-8 flex justify-center bg-uilines items-center text-neutral-900 text-2xl">
          {`Artifacts (${displayArtifactData.length})`}
        </div>
        <div className="scrollbar w-full h-full flex flex-col p-7 pt-4 text-uitext leading-5 space-y-2">
          {displayArtifactData.map((artifact, index) => (
            <div key={index}>
              <div className=" uppercase text-xl">{artifact.name}</div>
              {Object.keys(artifact.params).map((key, index) => (
                <div className=" text-xs" key={index}>
                  {artifact.params[key].name}: {artifact.params[key].value}
                </div>
              ))}
              {/* <div>{artifact.params}</div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
