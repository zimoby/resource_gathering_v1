import { useEffect, useState } from "react";
import { PhrasesCollection } from "./PhrasesCollection";
import { SETTING_EDUCATION_MODE, useGameStore } from "../../store/store";
import { educationalStepsPhrases } from "./educationalStepsPhrases";
// import { consoleLog, useCheckVariableRender } from "../../utils/functions";

// interface PhraseSystemOptions {
//   minDuration?: number;
//   maxDuration?: number;
//   phraseDuration?: number;
//   firstAppearing?: boolean;
// }

const getRandomPhrase = () => {
  const randomIndex = Math.floor(Math.random() * PhrasesCollection.length);
  return PhrasesCollection[randomIndex];
};

const randomisePhrase = (activePhrase: string) => {
  let newPhrase = getRandomPhrase();

  while (newPhrase === activePhrase) {
    newPhrase = getRandomPhrase();
  }

  return newPhrase;
};

interface ActivePhraseType {
  phrase: string;
  skipped?: boolean;
}

const usePhraseSystem = () => {
  const [activePhrase, setActivePhrase] = useState<ActivePhraseType>({
    phrase: "",
  });
  const [phraseKey, setPhraseKey] = useState<number>(0);
  const [firstGreetings, setFirstGreetings] = useState<boolean>(true);
  const educationalStepIndex = useGameStore(
    (state) => state.educationalStepIndex,
  );
  const increaseEducationalStepIndex = useGameStore(
    (state) => state.increaseEducationalStepIndex,
  );
  // const [educationalStepIndex, setEducationalStepIndex] = useState(0);
  const educationMode = useGameStore((state) => state.educationMode);
  const beacons = useGameStore((state) => state.beacons);
  const soloPanelOpacity = useGameStore((state) => state.soloPanelOpacity);
  const resetPanelsOpacity = useGameStore((state) => state.resetPanelsOpacity);
  const animationFirstStage = useGameStore(
    (state) => state.animationFirstStage,
  );
  const updateVariableInLocalStorage = useGameStore(
    (state) => state.updateVariableInLocalStorage,
  );

  // useCheckVariableRender(educationMode, "educationMode");
  // useCheckVariableRender(firstGreetings, "firstGreetings");

  useEffect(() => {
    if (!educationMode) {
      // consoleLog("reset", { educationMode, firstGreetings });
      setFirstGreetings(false);
      setActivePhrase({ phrase: "" });
    } else {
      setFirstGreetings(true);
    }

    // consoleLog("educationMode", { educationMode, firstGreetings });

    if (educationMode && firstGreetings && animationFirstStage) {
      setActivePhrase(educationalStepsPhrases[educationalStepIndex]);
      setPhraseKey((prevKey) => prevKey + 1);
    }

    if (
      firstGreetings &&
      animationFirstStage &&
      beacons.length > 0 &&
      educationalStepIndex === 1
    ) {
      if (educationalStepIndex < educationalStepsPhrases.length - 1) {
        increaseEducationalStepIndex();
      }
    }

    if (educationalStepsPhrases[educationalStepIndex].stage === "welcome") {
      soloPanelOpacity();
    } else if (
      educationalStepsPhrases[educationalStepIndex].stage ===
      "collectedResourcesPanel"
    ) {
      soloPanelOpacity("collectedResourcesPanel");
    } else if (
      educationalStepsPhrases[educationalStepIndex].stage === "progressPanel"
    ) {
      soloPanelOpacity("progressPanel");
    } else if (
      educationalStepsPhrases[educationalStepIndex].stage === "costsPanel"
    ) {
      soloPanelOpacity("costsPanel");
    } else if (
      educationalStepsPhrases[educationalStepIndex].stage === "newWorldButton"
    ) {
      soloPanelOpacity("newWorldButton");
    } else if (
      educationalStepsPhrases[educationalStepIndex].stage ===
      "collectedArtifactsPanel"
    ) {
      soloPanelOpacity("collectedArtifactsPanel");
    } else {
      resetPanelsOpacity();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    beacons.length,
    educationMode,
    educationalStepIndex,
    animationFirstStage,
    firstGreetings,
  ]);

  useEffect(() => {
    // consoleLog("useEffect selectRandomPhrase", { educationMode });

    let timeoutId: number | undefined;

    if (!educationMode) {
      const selectRandomPhrase = () => {
        const newPhrase = randomisePhrase(activePhrase.phrase);
        setActivePhrase({ phrase: newPhrase });
        setPhraseKey((prevKey) => prevKey + 1);
        // consoleLog("selectRandomPhrase", { educationMode, newPhrase });
        timeoutId = setTimeout(selectRandomPhrase, 10000);
        // return () => clearTimeout(timeout);
      };

      timeoutId = setTimeout(selectRandomPhrase, 10000);
    }
    return () => clearTimeout(timeoutId);
  }, [activePhrase, educationMode]);

  useEffect(() => {
    if (activePhrase.phrase !== "" && !educationMode) {
      const timeout = setTimeout(() => {
        setActivePhrase({ phrase: "" });
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [activePhrase, phraseKey, educationMode]);

  const handleNextClick = () => {
    if (educationalStepIndex < educationalStepsPhrases.length - 1) {
      increaseEducationalStepIndex();
      // setEducationalStepIndex((prevIndex) => prevIndex + 1);
    } else {
      setFirstGreetings(false);
      updateVariableInLocalStorage(SETTING_EDUCATION_MODE, false);
      setActivePhrase({ phrase: "" });
    }
  };

  return {
    activePhrase,
    phraseKey,
    handleNextClick,
  };
};

export default usePhraseSystem;
