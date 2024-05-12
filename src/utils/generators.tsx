import { WeatherCondition, WorldState } from "../store";

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

const worldStates = ["extreme", "danger", "normal", "safe"];

type WorldParamsType = {
  seed: string;
  worldState: WorldState;
  name: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  pollution: number;
  radiation: number;
  weatherCondition: WeatherCondition;
}


export const generateWorld = (): WorldParamsType => {
  const worldSeed = Math.random().toString(36).substring(7);
  const worldState = worldStates[Math.floor(Math.random() * worldStates.length)];
  const worldName = "";
  // const worldName = worldSeed + "-" + worldState;
  const temperature = Math.floor(Math.random() * 100);
  const humidity = Math.floor(Math.random() * 100);
  const windSpeed = Math.floor(Math.random() * 100);
  const pollution = Math.floor(Math.random() * 100);
  const radiation = Math.floor(Math.random() * 100);
  const weatherCondition = generateWeather();

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
  };
}