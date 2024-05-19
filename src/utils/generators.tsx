import { WeatherCondition, WorldState } from "../store/worldParamsSlice";
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

// const worldStates = ["safe", "normal", "danger", "extreme", "hazardous", "stormy", "extreme temperature"]

export const generateWorld = (): WorldParamsType => {
  const worldSeed = Math.random().toString(36).substring(7);
  // const worldState = worldStates[Math.floor(Math.random() * worldStates.length)];
  const worldName = "";
  // const worldName = worldSeed + "-" + worldState;
  const temperature = Math.floor(-50 + Math.random() * 150);
  const humidity = Math.floor(Math.random() * 100);
  const windSpeed = Math.floor(Math.random() * 200);
  const pollution = Math.floor(Math.random() * 500);
  const radiation = Math.floor(Math.random() * 1000);
  const weatherCondition = generateWeather();

  // calculate world state depending on the values
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
  };
}