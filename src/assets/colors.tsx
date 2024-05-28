export const colors = {
  primary: "#1da1f2",
  secondary: "#14171a",
  background: "#ffffff",
  uilines: "#eeba11",
  uitext: "#f1e31a",
};

export interface Colors {
  primary: string;
  secondary: string;
  background: string;
  uilines: string;
  uitext: string;
}

export const setColors = (newColors: Partial<Colors>): void => {
  Object.entries(newColors).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--${key}-color`, value);
  });
};
