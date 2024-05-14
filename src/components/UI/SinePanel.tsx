export const SinePanel = () => {
  return (
    <div
      className="h-full w-full border border-uilines overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--color-uitext) 0.5px, transparent 0.5px), linear-gradient(to bottom, var(--color-uitext) 0.5px, transparent 0.5px)",
        backgroundSize: "1rem 1rem",
      }}
    >
      <svg width="200%" height="100%" viewBox="0 0 200 10" preserveAspectRatio="none">
        <g id="repeating-group-1" className="">
          <path
            d="M 0,3 Q 12.5,-2 25,3 T 50,3 T 75,3 T 100,3 T 125,3 T 150,3 T 175,3 T 200,3"
            fill="transparent"
            stroke="white"
            strokeWidth="0.2"
          />
        </g>
        <g id="repeating-group-2">
          <path
            d="M 0,5 Q 12.5,0 25,5 T 50,5 T 75,5 T 100,5 T 125,5 T 150,5 T 175,5 T 200,5"
            fill="transparent"
            stroke="yellow"
            strokeWidth="0.2"
          />
        </g>
        <g id="repeating-group-3">
          <path
            d="M 0,7 Q 12.5,12 25,7 T 50,7 T 75,7 T 100,7 T 125,7 T 150,7 T 175,7 T 200,7"
            fill="transparent"
            stroke="blue"
            strokeWidth="0.2"
          />
        </g>
        <g id="repeating-group-4">
          <path
            d="M 0,9 Q 12.5,4 25,9 T 50,9 T 75,9 T 100,9 T 125,9 T 150,9 T 175,9 T 200,9"
            fill="transparent"
            stroke="green"
            strokeWidth="0.2"
          />
        </g>
      </svg>
    </div>
  );
};
