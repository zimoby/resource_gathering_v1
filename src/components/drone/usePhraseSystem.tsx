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

const usePhraseSystem = ({
  // minDuration = 10,
  // maxDuration = 20,
  // phraseDuration = 5,
	firstAppearing
}: PhraseSystemOptions) => {
  const [activePhrase, setActivePhrase] = useState<string>("");
  const [phraseKey, setPhraseKey] = useState<number>(0);
	const [firstGreatings, setFirstGreatings] = useState<boolean>(true);

	useEffect(() => {
		if(firstGreatings && !firstAppearing) {
			setActivePhrase("Hello, I'm your drone. I will help you to gather resources.");
			setPhraseKey((prevKey) => prevKey + 1);
			setFirstGreatings(false);

		}
	}, [firstAppearing, firstGreatings]);

  useEffect(() => {
    const selectRandomPhrase = () => {

			const newPhrase = randomisePhrase(activePhrase);
      setActivePhrase(newPhrase);
      setPhraseKey((prevKey) => prevKey + 1);

      // const randomDuration = Math.floor(Math.random() * 11) + 10;
      const timeout = setTimeout(selectRandomPhrase, 10000);
      // const timeout = setTimeout(selectRandomPhrase, randomDuration * 1000);

      return () => clearTimeout(timeout);
    };

    const initialTimeout = setTimeout(selectRandomPhrase, 10000);

    return () => clearTimeout(initialTimeout);
  }, [activePhrase]);

  useEffect(() => {
    if (activePhrase !== "") {
      const timeout = setTimeout(() => {
        setActivePhrase("");
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [activePhrase, phraseKey]);

  return {
    activePhrase,
    phraseKey,
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
// 	const eventsLog = useGamaStore((state) => state.eventsLog);

// 	const [firstGreatings, setFirstGreatings] = useState<boolean>(true);

// 	// useEffect(() => {
// 	// 	console.log("eventsLog:", eventsLog);
// 	// }, [eventsLog]);

// 	useEffect(() => {
// 		if( firstGreatings) {
// 			setActivePhrase("Hello, I'm your drone. I will help you to gather resources.");
// 			setPhraseKey((prevKey) => prevKey + 1);
// 			setFirstGreatings(false);

// 		}
// 	}, [firstGreatings]);

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
