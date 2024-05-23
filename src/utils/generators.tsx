import { Color } from "three";
import { ArtefactT, ArtefactType, WeatherCondition, WorldState } from "../store/worldParamsSlice";
import { WorldParamsType } from "../store/worldParamsSlice";

export const generateWeather = (): WeatherCondition => {
  const randomValue = Math.random();
  if (randomValue < 0.7) {
    return "mild";
  } else if (randomValue < 0.9) {
    return "moderate";
  } else {
    return "severe";
  }
};

export const generateWorld = (): WorldParamsType => {
  const worldSeed = Math.random().toString(36).substring(7);
  const worldName = "";
  const temperature = Math.floor(-50 + Math.random() * 150);
  const humidity = Math.floor(Math.random() * 100);
  const windSpeed = Math.floor(Math.random() * 200);
  const pollution = Math.floor(Math.random() * 500);
  const radiation = Math.floor(Math.random() * 1000);
  const weatherCondition = generateWeather();

  // min 0.1, max 0.9
  const largeDetailes = Math.random() * 0.8 + 0.1;
  const mediumDetailes = Math.random() * 0.8 + 0.1;
  const smallDetailes = Math.random() * 0.8 + 0.1;

  let worldState = "safe";
  if (pollution > 300 || radiation > 300) {
    worldState = "hazardous";
  } else if (windSpeed > 100) {
    worldState = "stormy";
  } else if (temperature > 50 || temperature < -20) {
    worldState = "extreme temperature";
  } else if (radiation > 100 || pollution > 100) {
    worldState = "danger";
  }

  return {
    seed: worldSeed,
    worldState: worldState as WorldState, 
    name: worldName,
    temperature,
    humidity,
    windSpeed,
    pollution,
    radiation,
    weatherCondition,
    mapDetailes: [
      largeDetailes,
      mediumDetailes,
      smallDetailes,
    ]
  };
}

const randomRarestTypes = (): ArtefactType => {
  const randomValue = Math.random();
  if (randomValue < 0.6) {
    return "usual";
  } else if (randomValue < 0.8) {
    return "rare";
  } else {
    return "legendary";
  }
}

export const generateArtefacts = ({amount = 10}: {amount?: number}): ArtefactT[] => {
  const artefacts: ArtefactT[] = [
    // {
    //   x: 0,
    //   y: 0,
    //   z: 0,
    //   type: "legendary",
    //   chunkX: 0,
    //   chunkY: 0,
    //   visible: true,
    //   id: Math.random().toString(36).substr(2, 9),
    // },
  ];
  for (let i = 0; i < amount; i++) {
    artefacts.push({
      x: Math.floor(Math.random() * 100) - 50,
      y: 0,
      z: Math.floor(Math.random() * 100) - 50,
      type: randomRarestTypes(),
      chunkX: Math.floor(Math.random() * 10) - 5,
      chunkY: Math.floor(Math.random() * 10) - 5,
      visible: true,
      id: Math.random().toString(36).substr(2, 9),
    });
  }
  return artefacts;
}

export const generateRandomColor = () => {
  const hue = Math.random() * 360;
  const saturation = 70;
  const lightness = 70;
  return new Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
}
