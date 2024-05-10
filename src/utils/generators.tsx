import { WeatherCondition } from "../store";

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