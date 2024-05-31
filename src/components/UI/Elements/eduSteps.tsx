import { useCallback } from "react";
import { educationalStepsPhrases } from "../../drone/educationalStepsPhrases";
import { SETTING_EDUCATION_MODE, useGameStore } from "../../../store/store";

export const EducationSteps = () => {
  const educationMode = useGameStore((state) => state.educationMode);
  const educationalStepIndex = useGameStore(
    (state) => state.educationalStepIndex,
  );
  const updateVariableInLocalStorage = useGameStore(
    (state) => state.updateVariableInLocalStorage,
  );
  const resetPanelsOpacity = useGameStore((state) => state.resetPanelsOpacity);

  const currentEduStep = educationalStepsPhrases[educationalStepIndex].step;

  const eduStepsNames = [
    { name: "Welcome", id: "welcome1", startIndex: 0 },
    { name: "Gather resources", id: "resources1", startIndex: 1 },
    { name: "Collect Energy", id: "energy1", startIndex: 5 },
    { name: "Map movement", id: "mapmove1", startIndex: 8 },
    { name: "Artifacts", id: "artifacts1", startIndex: 10 },
  ];

  const changeEduIndex = useCallback(
    (index = 0) => {
      updateVariableInLocalStorage(SETTING_EDUCATION_MODE, true);
      useGameStore.setState({
        educationMode: true,
        educationalStepIndex: index,
      });
    },
    [updateVariableInLocalStorage],
  );

  const finishTutorial = useCallback(() => {
    updateVariableInLocalStorage(SETTING_EDUCATION_MODE, false);
    useGameStore.setState({ educationMode: false, educationalStepIndex: 0 });
    resetPanelsOpacity();
  }, [resetPanelsOpacity, updateVariableInLocalStorage]);

  return (
    <div className="flex flex-col">
      {educationMode && (
        <>
          <div>
            <p className=" orbitron text-uitext">Tutor Steps:</p>
          </div>
          <div className="flex w-44 flex-col space-y-1 justify-center items-start">
            {eduStepsNames.map((step, index) => (
              <div
                key={step.id}
                className={`w-full flex flex-row px-2 cursor-pointer border-l-8 border-l-uilines hover:bg-uilines hover:text-neutral-900 ${currentEduStep === index ? "bg-uilines text-neutral-900 " : " border border-uilines text-uitext"}`}
                onClick={() => changeEduIndex(step.startIndex)}
              >
                {currentEduStep === index && (
                  <p className=" mr-2 text-xs"> {"→"} </p>
                )}
                <p className=" text-xs">{`${index + 1}. ${step.name}`}</p>
              </div>
            ))}
            <div
              className={`w-fit mt-2 flex text-xs flex-row px-2 cursor-pointer border-l-uilines hover:bg-uilines hover:text-neutral-900 border border-uilines text-uitext`}
              onClick={finishTutorial}
            >
              Skip Tutor
            </div>
          </div>
        </>
      )}
      {!educationMode && (
        <div>
          <button
            className="orbitron uppercase border border-uilines px-2 text-xs text-uitext cursor-pointer hover:text-neutral-900 hover:bg-uilines"
            onClick={() => changeEduIndex()}
          >
            Tutorial
          </button>
        </div>
      )}
    </div>
  );
};
