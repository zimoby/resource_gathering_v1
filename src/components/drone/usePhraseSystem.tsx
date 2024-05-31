import { useEffect, useState } from "react";
import { PhrasesCollection } from "./PhrasesCollection";
import { SETTING_EDUCATION_MODE, useGameStore } from "../../store/store";
import { educationalStepsPhrases } from "./educationalStepsPhrases";
import { colors } from "../../assets/colors";

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
  const playerPoints = useGameStore((state) => state.playerPoints);
  const setColors = useGameStore((state) => state.setColors);

  const [gameOverState, setGameOverState] = useState(false);

  useEffect(() => {
    if (playerPoints <= 0 && beacons.length === 0) {
      setGameOverState(true);
      setActivePhrase({
        phrase: "SOS. No energy left. We are lost on this planet.",
      });
      const newColors = {
        ...colors,
        uilines: "#E22D2D",
        uitext: "#E22D2D",
      };
      setColors(newColors);
    }
  }, [playerPoints, beacons.length, setColors]);

  useEffect(() => {
    if (!educationMode) {
      setFirstGreetings(false);
      setActivePhrase({ phrase: "" });
    } else {
      setFirstGreetings(true);
    }

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
      educationalStepsPhrases[educationalStepIndex].stage ===
      "systemControlsPanel"
    ) {
      soloPanelOpacity("systemControlsPanel");
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
    let timeoutId: number | undefined;

    if (!educationMode && !gameOverState) {
      const selectRandomPhrase = () => {
        const newPhrase = randomisePhrase(activePhrase.phrase);
        setActivePhrase({ phrase: newPhrase });
        setPhraseKey((prevKey) => prevKey + 1);
        timeoutId = setTimeout(selectRandomPhrase, 10000);
      };

      timeoutId = setTimeout(selectRandomPhrase, 10000);
    }
    return () => clearTimeout(timeoutId);
  }, [activePhrase, educationMode, gameOverState]);

  useEffect(() => {
    if (activePhrase.phrase !== "" && !educationMode && !gameOverState) {
      const timeout = setTimeout(() => {
        setActivePhrase({ phrase: "" });
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [activePhrase, phraseKey, educationMode, gameOverState]);

  const handleNextClick = () => {
    if (educationalStepIndex < educationalStepsPhrases.length - 1) {
      increaseEducationalStepIndex();
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
