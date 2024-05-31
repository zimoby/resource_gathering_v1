import { Color } from "three";
import {
  ArtifactT,
  ArtifactType,
  WeatherCondition,
  WorldState,
} from "../store/worldParamsSlice";
import { WorldParamsType } from "../store/worldParamsSlice";

export const generateWeather = (): WeatherCondition => {
  const randomValue = Math.random();
  if (randomValue < 0.7) {
    return "Mild";
  } else if (randomValue < 0.9) {
    return "Moderate";
  } else {
    return "Severe";
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

  const largeDetailes = Math.random() * 0.8 + 0.1;
  const mediumDetailes = Math.random() * 0.8 + 0.1;
  const smallDetailes = Math.random() * 0.8 + 0.1;

  let worldState = "Safe";
  if (pollution > 300 || radiation > 300) {
    worldState = "Hazardous";
  } else if (windSpeed > 100) {
    worldState = "Stormy";
  } else if (temperature > 50 || temperature < -20) {
    worldState = "Extreme temperature";
  } else if (radiation > 100 || pollution > 100) {
    worldState = "Danger";
  }

  return {
    seed: {
      value: worldSeed,
      name: "Seed",
    },
    worldState: {
      name: "World",
      value: worldState,
    } as WorldState,
    name: {
      value: worldName,
      name: "Name",
    },
    temperature: {
      name: "Temperature",
      value: temperature,
      max: 50,
      min: -20,
    },
    humidity: {
      name: "Humidity",
      value: humidity,
      max: 150,
      min: -50,
    },
    windSpeed: {
      name: "Wind Speed",
      value: windSpeed,
      max: 100,
      min: 0,
    },
    pollution: {
      name: "Pollution",
      value: pollution,
      max: 100,
      min: 0,
    },
    radiation: {
      name: "Radiation",
      value: radiation,
      max: 100,
      min: 0,
    },
    weatherCondition,
    mapDetailes: [largeDetailes, mediumDetailes, smallDetailes],
  };
};

const randomRarestTypes = (): ArtifactType => {
  const randomValue = Math.random();
  if (randomValue < 0.6) {
    return "usual";
  } else if (randomValue < 0.8) {
    return "rare";
  } else {
    return "legendary";
  }
};

const generateUniqArtefactName = () => {
  const adjectives = [
    "Ancient",
    "Forgotten",
    "Mysterious",
    "Magical",
    "Enchanted",
    "Cursed",
    "Blessed",
    "Divine",
    "Sacred",
    "Holy",
    "Unholy",
    "Dark",
    "Light",
    "Eternal",
    "Infinite",
    "Infernal",
    "Celestial",
    "Abyssal",
    "Eldritch",
    "Arcane",
    "Mystic",
    "Mythical",
    "Legendary",
  ];

  const adjectivesExtra = [
    "Golden",
    "Silver",
    "Bronze",
    "Crystal",
    "Sapphire",
    "Ruby",
    "Emerald",
    "Diamond",
    "Amethyst",
    "Topaz",
    "Opal",
    "Pearl",
    "Obsidian",
    "Onyx",
    "Jade",
    "Ivory",
    "Platinum",
    "Titanium",
    "Copper",
    "Iron",
    "Steel",
    "Adamantium",
    "Mithril",
    "Orichalcum",
    "Plutonium",
    "Uranium",
    "Neptunium",
    "Mercury",
    "Lead",
    "Tin",
    "Aluminium",
    "Cobalt",
    "Nickel",
    "Zinc",
    "Oxygen",
    "Nitrogen",
    "Hydrogen",
    "Helium",
    "Lithium",
    "Beryllium",
    "Boron",
    "Sodium",
    "Potassium",
    "Calcium",
    "Scandium",
    "Titanium",
    "Vanadium",
    "Chromium",
    "Manganese",
    "Iron",
    "Cobalt",
    "Nickel",
    "Copper",
    "Zinc",
    "Tin",
    "Antimony",
    "Tellurium",
    "Iodine",
    "Xenon",
    "Caesium",
    "Barium",
    "Lanthanum",
    "Cerium",
    "Praseodymium",
    "Neodymium",
    "Promethium",
    "Samarium",
    "Europium",
    "Gadolinium",
    "Terbium",
  ];

  const randomAdjective1 =
    adjectivesExtra[Math.floor(Math.random() * adjectivesExtra.length)];
  const randomAdjective2 =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const name = `${randomAdjective1} ${randomAdjective2}`;
  return name;
};

const generateUniqArtefactParams = () => {
  const weight = Math.floor(Math.random() * 1000);
  const power = Math.floor(Math.random() * 1000);
  // physical properties
  const width = Math.floor(Math.random() * 100);
  const height = Math.floor(Math.random() * 100);
  const density = Math.floor(Math.random() * 100);
  // chemical properties
  const atomicNumber = Math.floor(Math.random() * 100);
  const meltingPoint = Math.floor(Math.random() * 100);
  const boilingPoint = Math.floor(Math.random() * 100);
  const radioactivity = Math.floor(Math.random() * 100);

  const collectAllParams = {
    weight: {
      name: "Weight",
      value: weight,
    },
    power: {
      name: "Power",
      value: power,
    },
    width: {
      name: "Width",
      value: width,
    },
    height: {
      name: "Height",
      value: height,
    },
    density: {
      name: "Density",
      value: density,
    },
    atomicNumber: {
      name: "Atomic Number",
      value: atomicNumber,
    },
    meltingPoint: {
      name: "Melting Point",
      value: meltingPoint,
    },
    boilingPoint: {
      name: "Boiling Point",
      value: boilingPoint,
    },
    radioactivity: {
      name: "Radioactivity",
      value: radioactivity,
    },
  };

  return collectAllParams;
};

export const generateArtifacts = ({
  amount = 10,
  worldId = "",
}: {
  amount?: number;
  worldId?: string;
}): ArtifactT[] => {
  const artifacts: ArtifactT[] = [
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
    artifacts.push({
      x: Math.floor(Math.random() * 100) - 50,
      y: -10,
      z: Math.floor(Math.random() * 100) - 50,
      type: randomRarestTypes(),
      chunkX: Math.floor(Math.random() * 10) - 5,
      chunkY: Math.floor(Math.random() * 10) - 5,
      visible: true,
      id: Math.random().toString(36).substr(2, 9),
      name: generateUniqArtefactName(),
      params: generateUniqArtefactParams(),
      worldId,
    });
  }
  return artifacts;
};

export const generateRandomColor = () => {
  const hue = Math.random() * 360;
  const saturation = 70;
  const lightness = 70;
  return new Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
};
