import { useEffect, useState } from "react";
import { useGameStore } from "../store/store";
import { Howl } from "howler";
import { consoleLog } from "../utils/functions";

export const useSoundSystem = () => {
  const startToLoadFiles = useGameStore((state) => state.startToLoadFiles);
  const [soundsLoadingProgress, setSoundsLoadingProgress] = useState(0);

  const [sounds, setSounds] = useState<{
    ambient: Howl | null;
    click: Howl | null;
    landing: Howl | null;
    glitch: Howl | null;
  }>({
    ambient: null,
    click: null,
    landing: null,
    glitch: null,
  });

  useEffect(() => {
    useGameStore.setState({ loadingProgress: soundsLoadingProgress });
  }, [soundsLoadingProgress]);

  useEffect(() => {
    if (!startToLoadFiles) return;

    if (!sounds.ambient && !sounds.click && !sounds.landing && !sounds.glitch) {
      const ambientSound = new Howl({
        src: ["./mystic-forest-ambient-23812.mp3"],
        loop: true,
        volume: 0.2,
        onload: () => {
          setSoundsLoadingProgress((prev) =>
            Math.ceil(prev + (1 / Object.keys(sounds).length) * 100),
          );
          setSounds((prev) => ({ ...prev, ambient: ambientSound }));
        },
      });

      const clickSound = new Howl({
        src: ["./mouse-click-153941.mp3"],
        volume: 0.1,
        onload: () => {
          setSoundsLoadingProgress((prev) =>
            Math.ceil(prev + (1 / Object.keys(sounds).length) * 100),
          );
          setSounds((prev) => ({ ...prev, click: clickSound }));
        },
      });

      const landingSound = new Howl({
        src: ["./sci-fi-sound-effect-designed-circuits-hum-24-200825.mp3"],
        volume: 0.1,
        onload: () => {
          setSoundsLoadingProgress((prev) =>
            Math.ceil(prev + (1 / Object.keys(sounds).length) * 100),
          );
          setSounds((prev) => ({ ...prev, landing: landingSound }));
        },
      });

      const glitchSound = new Howl({
        src: ["./glitch-162763_mix.mp3"],
        volume: 0.1,
        onload: () => {
          setSoundsLoadingProgress((prev) =>
            Math.ceil(prev + (1 / Object.keys(sounds).length) * 100),
          );
          setSounds((prev) => ({ ...prev, glitch: glitchSound }));
        },
      });
    }

    return () => {
      if (sounds.ambient) sounds.ambient.unload();
      if (sounds.click) sounds.click.unload();
      if (sounds.landing) sounds.landing.unload();
      if (sounds.glitch) sounds.glitch.unload();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startToLoadFiles]);

  return { sounds };
};

export const useRunBgMusic = () => {
  const disableSounds = useGameStore((state) => state.disableSounds);
  const disableMusic = useGameStore((state) => state.disableMusic);
  const loadingProgress = useGameStore((state) => state.loadingProgress);
  const [ambientWorks, setAmbientWorks] = useState(false);

  const { sounds } = useSoundSystem();

  useEffect(() => {
    if ((disableSounds || disableMusic) && sounds.ambient && ambientWorks) {
      consoleLog("sounds.ambient.stop()");
      sounds.ambient.stop();
      setAmbientWorks(false);
    } else if (
      !disableSounds &&
      !disableMusic &&
      sounds.ambient &&
      loadingProgress >= 100 &&
      !ambientWorks
    ) {
      if (disableMusic) return;
      consoleLog("sounds.ambient.play()");
      sounds.ambient.stop();
      sounds.ambient.play();
      setAmbientWorks(true);
    }
  }, [disableSounds, sounds, loadingProgress, ambientWorks, disableMusic]);
};
