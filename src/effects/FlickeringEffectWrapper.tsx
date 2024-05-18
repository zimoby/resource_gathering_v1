import { useEffect, useRef, ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { useAppearingGlitchingEffect } from "./AppearingGlitchingEffect";
import { useGameStore } from "../store";

interface FlickeringEffectProps {
  children: ReactNode;
  disabled?: boolean;
  appearingOnly?: boolean;
  initialIntensity?: number;
  randomFrequency?: number;
  duration?: number;
}

export const FlickeringEffect: React.FC<FlickeringEffectProps> = ({
  children,
  disabled = false,
  appearingOnly = false,
  initialIntensity = 10,
  randomFrequency = 0.01,
  duration = 100,
}) => {
  const groupRef = useRef<Group>(null);
  const disableAnimations = useGameStore((state) => state.disableAnimations);

  useEffect(() => {
    const group = groupRef.current;
    if ((disabled || disableAnimations) && group) {
      group.children.forEach((child) => {
        child.visible = true;
      });
      return;
    }
  }, [disableAnimations, disabled]);

	useAppearingGlitchingEffect({ disabled, groupRef, duration, initialIntensity });

  useFrame(() => {
    if (appearingOnly || disabled) return;

    const group = groupRef.current;

    // if (disabled) {
    //     if (group) {
    //         group.children.forEach(child => {
    //             child.visible = true;
    //         });
    //     }
    //     return;
    // }

    if (group) {
      group.children.forEach((child) => {
        if (Math.random() < randomFrequency) {
          child.visible = !child.visible;
        }
      });
    }
  });

  return <group ref={groupRef}>{children}</group>;
};


// import React, { useEffect, useRef } from 'react';
// import { useFrame } from '@react-three/fiber';

// const FlickeringEffect = ({ children, initialIntensity = 10, randomFrequency = 0.008, duration = 100 }) => {
//   const isVisible = useRef(true);
//   const groupRef = useRef();

//   useEffect(() => {
//     const timeouts = [];
//     let lastToggle = 0;
//     for (let i = 0; i < initialIntensity; i++) {
//       lastToggle += Math.random() * duration;
//       timeouts.push(setTimeout(() => {
//         isVisible.current = !isVisible.current;
//         if (groupRef.current) {
//           groupRef.current.visible = isVisible.current;
//         }
//       }, lastToggle));
//     }

//     return () => timeouts.forEach(clearTimeout);
//   }, [initialIntensity, duration]);

//   useFrame(() => {
//     if (Math.random() < randomFrequency) {
//       isVisible.current = !isVisible.current;
//       if (groupRef.current) {
//         groupRef.current.visible = isVisible.current;
//       }
//     }
//   });

//   return (
//     <group ref={groupRef} visible={isVisible.current}>
//       {children}
//     </group>
//   );
// };

// export default FlickeringEffect;
