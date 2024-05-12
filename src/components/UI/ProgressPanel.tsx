import { useGameStore } from "../../store";

export const ProgressBlock = () => {
  const playerPoints = useGameStore((state) => state.playerPoints);
  const opacity = useGameStore((state) => state.uiPanelsState.progressPanel.opacity);

  const goal = 20000; // The maximum points or goal

  // Calculate the percentage of progress for each block relative to the goal
  const progressPercent = playerPoints / goal * 100;
  const blockWidths = [44, 24, 12, 3]; // Widths of each block in arbitrary units
  // const totalWidth = blockWidths.reduce((total, width) => total + width, 0); // Sum of all block widths

  // Calculate fill width of each block
  const blockFills = blockWidths.map(width => {
    const fill = Math.max(0, Math.min(width, progressPercent - blockWidths.slice(0, blockWidths.indexOf(width)).reduce((acc, w) => acc + w, 0)));
    return (fill / width) * 100; // Convert fill amount to percentage based on block's own width
  });

  return (
      <div className="flex w-80 h-16 flex-col -space-y-1" style={{ opacity }}>
        <div className="flex w-full h-full flex-row -space-x-0">
          {blockWidths.map((width, index) => (
            <div
              key={index}
              className={`w-${width} h-full mb-1 border border-neutral-200`}
              style={{
                background: `linear-gradient(to right, rgba(255, 255, 255, ${0.5 * ((index + 1) / 2)}) 0%, rgba(255, 255, 255, ${0.5 * ((index + 1) / 2)}) ${blockFills[index]}%, rgba(255, 255, 255, 0) ${blockFills[index]}%, rgba(255, 255, 255, 0) 100%)`,
              }}
            />
          ))}
        </div>
        <div className="flex w-full h-4 justify-between px-1 border bg-neutral-200 border-neutral-200 orbitron text-end text-2xs uppercase text-neutral-900">
					<p>
						Energy: {playerPoints} / {goal}
					</p>
					<p>
						Progress
					</p>
        </div>
      </div>
  );
};



// export const ProgressBlock = () => {
// 	const playerPoints = useGameStore((state) => state.playerPoints);

//   return (
//     <>
//       <div className="flex w-80 h-16 flex-col -space-y-1">
//         <div className="flex w-full h-full flex-row -space-x-1">
//           <div
//             className="w-44 h-full mb-1 border border-neutral-200"
//             // style={{ width: `${playerPoints / 10}%` }}
//             style={{
//               background: `linear-gradient(to right, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.5) ${
//                 playerPoints / 20
//               }%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 100%)`,
//             }}
//           />
//           <div className="w-24 h-full mb-1 border border-neutral-200 bg-neutral-900" />
//           <div className="w-12 h-full mb-1 border border-neutral-200 bg-neutral-900" />
//           <div className="w-3 h-full mb-1 border border-neutral-200 bg-neutral-900" />
//         </div>
//         <div className="flex w-full h-4 justify-end px-1 border bg-neutral-200 border-neutral-200 orbitron text-end text-2xs uppercase text-neutral-900">
//           Progress
//         </div>
//       </div>
//     </>
//   );
// };
