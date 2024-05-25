export const educationalStepsPhrases = [
  {
    phrase: "Hello, I'm your drone. I will help you to gather resources.",
    skipped: false,
  },
  {
    phrase: "To gather resources, hold Space and Click on the ground.",
    skipped: false,
  },
  {
    phrase: "Great! Information about resources will appear on the left side of the screen.",
    skipped: false,
    stage: "collectedResourcesPanel",
  },
  {
    phrase:
      "Resources gives you energy. Energy is needed for scaner work. Hold Space key to see how much energy the scanner is using. ",
    skipped: false,
    stage: "progressPanel",
  },
  {
    phrase: "The costs for the different actions are shown on the right side of the screen.",
    skipped: false,
    stage: "costsPanel",
  },
  {
    phrase: "When you archive energy progress, you can fly to another planet.",
    skipped: false,
    stage: "newWorldButton",
  },
  {
    phrase: "To change direction of scanning, use WASD or arrow keys. Hold Shift to speed up.",
    skipped: false,
  },
  {
    phrase: "On the planet you will find Artifacts. The white light around the map shows the side where the Artifact is. Brighter light means closer Artifact.",
		skipped: false,
		stage: "collectedArtifactsPanel",
  },
  {
    phrase: "To take the Artifact, move drone close to it with hold Space. Click on the artifact when it starts to move up or down.",
		skipped: false,
  },
  {
    phrase: "Now, let's collect some resources!",
    skipped: false,
  },
];
