import { RefObject, useEffect } from "react";
import { Group } from "three";
import { consoleLog } from "../utils/functions";

export const useAppearingGlitchingEffect = ({
  disabled,
  groupRef,
  duration = 300,
  initialIntensity = 10,
}: {
  disabled: boolean;
  groupRef: RefObject<Group>;
  duration?: number;
  initialIntensity?: number;
}) => {
  useEffect(() => {
    if (disabled) {
      return;
    }
    const group = groupRef.current;

    if (group) {
      consoleLog("useAppearingGlitchingEffect");
      const timeouts = new Set<number>();
      group.children.forEach((child) => {
        let lastToggle = 0;
        for (let i = 0; i < initialIntensity; i++) {
          lastToggle += Math.random() * duration;
          timeouts.add(
            setTimeout(() => {
              child.visible = !child.visible;
            }, lastToggle)
          );
        }
        child.visible = true;
      });
      return () => timeouts.forEach(clearTimeout);
    }
  }, [initialIntensity, duration, disabled, groupRef]);
};

// enable visibility of every child as random time range
// useEffect(() => {
//   if (disabled) { return; }
//   const group = groupRef.current;

//   if (group) {
//     const timeouts = new Set<number>();
//     group.children.forEach(
//       (child) => {
//         let lastToggle = 0;
//         // console.log("child:", child);
//         for (let i = 0; i < initialIntensity; i++) {
//           lastToggle += Math.random() * 1000;
//           timeouts.add(
//             setTimeout(() => {
//               if (child instanceof Mesh) {
//                 setMeshOpacity(child, Math.random() * (maxOpacity - minOpacity) + minOpacity);
//               }
//             }, lastToggle)
//           );
//         }
//       }
//     );
//     return () => timeouts.forEach(clearTimeout);
//   }
// }, [children, initialIntensity, minOpacity, maxOpacity, disabled]);
