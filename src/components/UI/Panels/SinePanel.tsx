import { useGameStore } from "../../../store/store";

export const SinePanel = () => {
	const collectedResources = useGameStore((state) => state.collectedResources);

  return (
    <div
      className="h-full border border-uilines overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--color-uitext) 0.5px, transparent 0.5px), linear-gradient(to bottom, var(--color-uitext) 0.5px, transparent 0.5px)",
        backgroundSize: "1rem 1rem",
      }}
    >
      <svg width="200%" height="100%" viewBox="0 0 200 10" preserveAspectRatio="none">
        <g id="repeating-group-1" className="">
          <path
            d="M 0,5 Q 12.5,0 25,5 T 50,5 T 75,5 T 100,5 T 125,5 T 150,5 T 175,5 T 200,5"
            fill="transparent"
            stroke="white"
            strokeWidth="0.2"
						style={{
							transform: `scaleY(${Math.min(collectedResources["Metals"] / 100, 1)})`,
							transformOrigin: "center",
						}}
          />
        </g>
        <g id="repeating-group-2">
          <path
            d="M 0,5 Q 12.5,0 25,5 T 50,5 T 75,5 T 100,5 T 125,5 T 150,5 T 175,5 T 200,5"
            fill="transparent"
            stroke="yellow"
            strokeWidth="0.2"
						style={{
							transform: `scaleY(${Math.min(collectedResources["Water"] / 100, 1)})`,
							transformOrigin: "center",
						}}
          />
        </g>
        <g id="repeating-group-3">
          <path
            d="M 0,5 Q 12.5,0 25,5 T 50,5 T 75,5 T 100,5 T 125,5 T 150,5 T 175,5 T 200,5"
            fill="transparent"
            stroke="blue"
            strokeWidth="0.2"
						style={{
							transform: `scaleY(${Math.min(collectedResources["Hydrocarbons"] / 100, 1)})`,
							transformOrigin: "center",
						}}
          />
        </g>
        <g id="repeating-group-4">
          <path
            d="M 0,5 Q 12.5,0 25,5 T 50,5 T 75,5 T 100,5 T 125,5 T 150,5 T 175,5 T 200,5"
            fill="transparent"
            stroke="green"
            strokeWidth="0.2"
						style={{
							transform: `scaleY(${Math.min(collectedResources["Rare Elements"] / 100, 1)})`,
							transformOrigin: "center",
						}}
          />
        </g>
      </svg>
    </div>
  );
};
