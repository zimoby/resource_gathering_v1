import { useEffect, useState } from "react";
import { PhrasesCollection } from "./PhrasesCollection";

interface PhraseSystemOptions {
  minDuration?: number;
  maxDuration?: number;
  phraseDuration?: number;
	firstAppearing?: boolean;
}

const getRandomPhrase = () => {
	const randomIndex = Math.floor(Math.random() * PhrasesCollection.length);
	return PhrasesCollection[randomIndex];
}

const randomisePhrase = (activePhrase: string) => {
	let newPhrase = getRandomPhrase();

	while (newPhrase === activePhrase) {
		newPhrase = getRandomPhrase();
	}

	return newPhrase;
}

export const educationalStepsPhrases = [
	{
		phrase: "Hello, I'm your drone. I will help you to gather resources.",
		skipped: false
	},
	{
		phrase: "To gather resources, hold Space and Click on the ground.",
		skipped: false
	},
];

type ActivePhraseType = {
	phrase: string;
	skipped?: boolean;
}


const usePhraseSystem = ({
  // minDuration = 10,
  // maxDuration = 20,
  // phraseDuration = 5,
	firstAppearing
}: PhraseSystemOptions) => {
  const [activePhrase, setActivePhrase] = useState<ActivePhraseType>({phrase: ""});
  const [phraseKey, setPhraseKey] = useState<number>(0);
	const [firstGreetings, setFirstGreetings] = useState<boolean>(true);
	const [educationalStepIndex, setEducationalStepIndex] = useState(0);
	// const beacons = useGameStore((state) => state.beacons);


	useEffect(() => {
		if(firstGreetings && !firstAppearing) {
			setActivePhrase(educationalStepsPhrases[educationalStepIndex]);
			setPhraseKey((prevKey) => prevKey + 1);
			// setFirstGreetings(false);
		}
	}, [educationalStepIndex, firstAppearing, firstGreetings]);


	// phrase: prevPhrase.educationalSteps[educationalStepIndex || 0],
	// skipped: (educationalStepIndex || 0) >= prevPhrase.educationalSteps.length - 1,


	useEffect(() => {
		if (!firstGreetings) {
			// setActivePhrase({ phrase: "" });
			// console.log("firstGreetings:", firstGreetings);
			const selectRandomPhrase = () => {
				// consoleLog("selectRandomPhrase");
				const newPhrase = randomisePhrase(activePhrase.phrase);
				// consoleLog("newPhrase:", { newPhrase });
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
        setActivePhrase({phrase: ""});
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [activePhrase, firstGreetings, phraseKey]);

	// useEffect(() => {
  //   if (useGameStore.getState().beacons.length > 0 && activePhrase.skipped) {
  //     setFirstGreetings(false);
  //   }
  // }, [activePhrase.skipped, beacons.length, setFirstGreetings]);


	const handleNextClick = () => {
    if (educationalStepIndex < educationalStepsPhrases.length - 1) {
      setEducationalStepIndex((prevIndex) => prevIndex + 1);
    } else {
      setFirstGreetings(false);
			setActivePhrase({ phrase: "" });
    }
  };

  return {
    activePhrase,
    phraseKey,
		handleNextClick
  };
};

// const usePhraseSystem = ({
//   minDuration = 10,
//   maxDuration = 20,
//   phraseDuration = 5,
// }: PhraseSystemOptions) => {
//   const [activePhrase, setActivePhrase] = useState<string>("");
//   const [phraseKey, setPhraseKey] = useState<number>(0);
// 	const [previousEvent, setPreviousEvent] = useState<string | null>(null);
// 	const eventsLog = useGameStore((state) => state.eventsLog);

// 	const [firstGreetings, setfirstGreetings] = useState<boolean>(true);

// 	// useEffect(() => {
// 	// 	console.log("eventsLog:", eventsLog);
// 	// }, [eventsLog]);

// 	useEffect(() => {
// 		if( firstGreetings) {
// 			setActivePhrase("Hello, I'm your drone. I will help you to gather resources.");
// 			setPhraseKey((prevKey) => prevKey + 1);
// 			setfirstGreetings(false);

// 		}
// 	}, [firstGreetings]);

// 	const selectPhrase = useCallback(() => {
// 		// if (eventsLog.length > 0) {
// 		// 	const currentEvent = eventsLog[eventsLog.length - 1];

// 		// 	if (currentEvent !== previousEvent) {
// 		// 		setActivePhrase(currentEvent);
// 		// 		setPhraseKey((prevKey) => prevKey + 1);
// 		// 		setPreviousEvent(currentEvent);
// 		// 		console.log("currentEvent:", currentEvent);
// 		// 	} else {
// 		// 		console.log("Same event, selecting random phrase");
// 		// 		const randomIndex = Math.floor(Math.random() * PhrasesCollection.length);
// 		// 		setActivePhrase(PhrasesCollection[randomIndex]);
// 		// 		setPhraseKey((prevKey) => prevKey + 1);
// 		// 	}
// 		// } else {
// 			// console.log("No events in log, selecting random phrase");
// 			const randomIndex = Math.floor(Math.random() * PhrasesCollection.length);
// 			setActivePhrase(PhrasesCollection[randomIndex]);
// 			setPhraseKey((prevKey) => prevKey + 1);
// 		// }

// 		const randomDuration =
// 			Math.floor(Math.random() * (maxDuration - minDuration + 1)) + minDuration;
// 		const timeout = setTimeout(selectPhrase, randomDuration * 1000);

// 		return () => clearTimeout(timeout);
// 	}, [maxDuration, minDuration, previousEvent, eventsLog]);

//   useEffect(() => {
//     const initialTimeout = setTimeout(selectPhrase, minDuration * 1000);
//     return () => clearTimeout(initialTimeout);
//   }, [selectPhrase, minDuration]);

//   useEffect(() => {
//     if (activePhrase !== "") {
//       const timeout = setTimeout(() => {
//         setActivePhrase("");
//       }, phraseDuration * 1000);

//       return () => clearTimeout(timeout);
//     }
//   }, [activePhrase, phraseKey, phraseDuration]);

//   return {
//     activePhrase,
//     phraseKey,
//   };
// };

export default usePhraseSystem;