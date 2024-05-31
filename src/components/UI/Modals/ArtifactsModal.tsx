import { useEffect, useMemo, useState } from "react";
import { useGameStore } from "../../../store/store";

export const ArtefactsModal = () => {
  const showArtifactsModal = useGameStore((state) => state.showArtifactsModal);
  const updateStoreProperty = useGameStore(
    (state) => state.updateStoreProperty,
  );
  const artifactsArray = useGameStore((state) => state.artifactsArray);
  const [expandedArtifacts, setExpandedArtifacts] = useState<number[]>([]);

  const displayArtifactData = useMemo(() => {
    const artifactsNames = Object.values(artifactsArray).map(
      (artifact) => artifact.name,
    );
    const artifactsParams = Object.values(artifactsArray).map(
      (artifact) => artifact.params,
    );
    const artifactsTypes = Object.values(artifactsArray).map(
      (artifact) => artifact.type,
    );
    const uniteData = artifactsNames.map((name, index) => {
      return {
        name: name,
        params: artifactsParams[index],
        type: artifactsTypes[index],
      };
    });
    return uniteData;
  }, [artifactsArray]);

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

  const toggleArtifact = (index: number) => {
    if (expandedArtifacts.includes(index)) {
      setExpandedArtifacts(expandedArtifacts.filter((i) => i !== index));
    } else {
      setExpandedArtifacts([...expandedArtifacts, index]);
    }
  };

  // const getColorByType = (type: ArtifactType) => {
  //   switch (type) {
  //     case "usual":
  //       return "text-gray-400";
  //     case "rare":
  //       return "text-blue-400";
  //     case "legendary":
  //       return "text-orange-400";
  //     default:
  //       return "text-white";
  //   }
  // };

  return (
    <div
      className="fixed w-full h-full flex justify-center items-center z-50 bg-black/50"
      style={{ display: showArtifactsModal ? "flex" : "none" }}
    >
      <div
        className="relative bg-black/80 w-96 h-1/2 flex flex-col border border-uilines aug-border-yellow-500"
        data-augmented-ui="border tl-2-clip-x br-2-clip-x --aug-border-bg"
      >
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
        <div className="scrollbar w-full h-full flex flex-col p-7 pt-4 text-uitext leading-5 space-y-1">
          {displayArtifactData.map((artifact, index) => (
            <div
              className="px-2 border border-uilines hover:bg-uilines hover:text-neutral-900"
              key={index}
            >
              <div
                className={`checked:border-indigo-500 flex items-center justify-between uppercase text-base cursor-pointer select-none`}
                onClick={() => toggleArtifact(index)}
              >
                <div className=" leading-5 py-1">{artifact.name}</div>
                <div>{artifact.type}</div>
              </div>
              {expandedArtifacts.includes(index) && (
                <>
                  {Object.keys(artifact.params).map((key, index) => (
                    <div className="text-xs" key={index}>
                      {artifact.params[key].name}: {artifact.params[key].value}
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
