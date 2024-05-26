import { useCallback, useEffect, useState } from "react";
import { useGameStore } from "../store/store";
import { Howl } from "howler";
import { consoleLog } from "../utils/functions";

export const useSoundSystem = () => {
  const disableSounds = useGameStore((state) => state.disableSounds);
	const startToLoadFiles = useGameStore((state) => state.startToLoadFiles);
	const loadingProgress = useGameStore((state) => state.loadingProgress);
	const [soundsLoadingProgress, setSoundsLoadingProgress] = useState(0);
	const [ambientWorks, setAmbientWorks] = useState(false);

  const [sounds, setSounds] = useState<{ ambient: Howl | null; click: Howl | null }>({
    ambient: null,
    click: null,
  });

	const playAmbientSound = useCallback(() => {
		// consoleLog("playAmbientSound", {disableSounds, ambient: sounds.ambient});
    if (!disableSounds && sounds.ambient) {
			// console.log("App sounds.ambient.play()");
      sounds.ambient.play();
    }
  }, [disableSounds, sounds]);

	const toggleAmbientSound = (state: boolean) => {
    if (!state && sounds.ambient) {
      sounds.ambient.stop();
			// consoleLog("sounds.ambient.stop()");
    } else if (state && sounds.ambient) {
      sounds.ambient.play();
			// consoleLog("sounds.ambient.play()");
    }
  };

	useEffect(() => {
		// console.log("soundsLoadingProgress", soundsLoadingProgress);
		useGameStore.setState({ loadingProgress: soundsLoadingProgress });
	}, [soundsLoadingProgress]);

  useEffect(() => {
		if (!startToLoadFiles) return;

    if (!sounds.ambient && !sounds.click) {
      const ambientSound = new Howl({
        src: ["./mystic-forest-ambient-23812.mp3"],
        loop: true,
        volume: 0.2,
        onload: () => {
          setSoundsLoadingProgress((prev) => prev + 50);
          setSounds((prev) => ({ ...prev, ambient: ambientSound }));
        },
      });

      const clickSound = new Howl({
        src: ["./mouse-click-153941.mp3"],
        volume: 0.1,
        onload: () => {
          setSoundsLoadingProgress((prev) => prev + 50);
          setSounds((prev) => ({ ...prev, click: clickSound }));
        },
      });
    }

    return () => {
      if (sounds.ambient) sounds.ambient.unload();
      if (sounds.click) sounds.click.unload();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startToLoadFiles]);


	// useEffect(() => {
  //   if (!ambientWorks && !disableSounds && loadingProgress === 100) {
  //     // console.log("sounds.ambient.stop()");
  //     setAmbientWorks(true);
  //     playAmbientSound();
  //   }
  // }, [loadingProgress, playAmbientSound, disableSounds, ambientWorks]);


	return { sounds };
};


export const useRunBgMusic = () => {
	const disableSounds = useGameStore((state) => state.disableSounds);
	const disableMusic = useGameStore((state) => state.disableMusic);
	const loadingProgress = useGameStore((state) => state.loadingProgress);
	const [ambientWorks, setAmbientWorks] = useState(false);

	const { sounds } = useSoundSystem();

  useEffect(() => {
		// console.log("sounds.ambient", {disableSounds, ambient: sounds.ambient, ambientWorks});
    if ((disableSounds || disableMusic) && sounds.ambient && ambientWorks) {
			consoleLog("sounds.ambient.stop()");
      sounds.ambient.stop();
			setAmbientWorks(false);
    } else if (
			((!disableSounds && !disableMusic) && sounds.ambient && loadingProgress === 100) && 
			!ambientWorks
		) {
			if (disableMusic) return;
			consoleLog("sounds.ambient.play()");
			sounds.ambient.stop();
      sounds.ambient.play();
			setAmbientWorks(true);
    }
  }, [disableSounds, sounds, loadingProgress, ambientWorks, disableMusic]);

}
