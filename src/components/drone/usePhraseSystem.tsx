import { useEffect, useState } from "react";
import { PhrasesCollection } from "./PhrasesCollection";
import { useGameStore } from "../../store/store";
import { educationalStepsPhrases } from "./educationalStepsPhrases";

interface PhraseSystemOptions {
  minDuration?: number;
  maxDuration?: number;
  phraseDuration?: number;
  firstAppearing?: boolean;
}

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

type ActivePhraseType = {
  phrase: string;
  skipped?: boolean;
};

const usePhraseSystem = ({ firstAppearing }: PhraseSystemOptions) => {
  const [activePhrase, setActivePhrase] = useState<ActivePhraseType>({ phrase: "" });
  const [phraseKey, setPhraseKey] = useState<number>(0);
  const [firstGreetings, setFirstGreetings] = useState<boolean>(true);
  const [educationalStepIndex, setEducationalStepIndex] = useState(0);
  const educationMode = useGameStore((state) => state.educationMode);
  const beacons = useGameStore((state) => state.beacons);
  const soloPanelOpacity = useGameStore((state) => state.soloPanelOpacity);
  const resetPanelsOpacity = useGameStore((state) => state.resetPanelsOpacity);

  useEffect(() => {
    if (!educationMode) {
      setFirstGreetings(false);
    }

    if (firstGreetings && !firstAppearing) {
      setActivePhrase(educationalStepsPhrases[educationalStepIndex]);
      setPhraseKey((prevKey) => prevKey + 1);
    }

    if (firstGreetings && !firstAppearing && beacons.length > 0 && educationalStepIndex === 1) {
      if (educationalStepIndex < educationalStepsPhrases.length - 1) {
        setEducationalStepIndex((prevIndex) => prevIndex + 1);
      }
    }

    if (educationalStepsPhrases[educationalStepIndex].stage === "collectedResourcesPanel" ) {
      soloPanelOpacity("collectedResourcesPanel");
    } else if (educationalStepsPhrases[educationalStepIndex].stage === "progressPanel") {
      soloPanelOpacity("progressPanel");
    } else if (educationalStepsPhrases[educationalStepIndex].stage === "costsPanel") {
      soloPanelOpacity("costsPanel");
    } else if (educationalStepsPhrases[educationalStepIndex].stage === "newWorldButton") {
      soloPanelOpacity("newWorldButton");
    } else if (educationalStepsPhrases[educationalStepIndex].stage === "collectedArtefactsPanel") {
      soloPanelOpacity("collectedArtefactsPanel");
    } else {
      resetPanelsOpacity();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beacons.length, educationMode, educationalStepIndex, firstAppearing, firstGreetings]);

  useEffect(() => {
    if (!firstGreetings) {
      const selectRandomPhrase = () => {
        const newPhrase = randomisePhrase(activePhrase.phrase);
        setActivePhrase({ phrase: newPhrase });
        setPhraseKey((prevKey) => prevKey + 1);
        const timeout = setTimeout(selectRandomPhrase, 10000);
        return () => clearTimeout(timeout);
      };

      const initialTimeout = setTimeout(selectRandomPhrase, 10000);
      return () => clearTimeout(initialTimeout);
    }
  }, [activePhrase, firstGreetings]);

  useEffect(() => {
    if (activePhrase.phrase !== "" && !firstGreetings) {
      const timeout = setTimeout(() => {
        setActivePhrase({ phrase: "" });
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [activePhrase, firstGreetings, phraseKey]);

  const handleNextClick = () => {
    if (educationalStepIndex < educationalStepsPhrases.length - 1) {
      setEducationalStepIndex((prevIndex) => prevIndex + 1);
    } else {
      setFirstGreetings(false);
      useGameStore.getState().updateEducationMode(false);
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
