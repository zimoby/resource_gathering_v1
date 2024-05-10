import { useEffect, useRef, ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

interface FlickeringEffectProps {
    children: ReactNode;
    appearingOnly?: boolean;
    initialIntensity?: number;
    randomFrequency?: number;
    duration?: number;
  }

  const FlickeringEffect: React.FC<FlickeringEffectProps> = ({
    children,
    appearingOnly = false,
    initialIntensity = 10,
    randomFrequency = 0.01,
    duration = 100,
  }) => {
    const groupRef = useRef<Group>(null);

    useEffect(() => {
        const group = groupRef.current;
        if (group) {
            const timeouts = new Set<number>();
            group.children.forEach((child) => {
                let lastToggle = 0;
                for (let i = 0; i < initialIntensity; i++) {
                    lastToggle += Math.random() * duration;
                    timeouts.add(setTimeout(() => {
                        child.visible = !child.visible;
                    }, lastToggle));
                }
                child.visible = true;
            });
            return () => timeouts.forEach(clearTimeout);
        }
    }, [initialIntensity, duration]);

    useFrame(() => {
        if (appearingOnly) return;
        const group = groupRef.current;
        if (group) {
            group.children.forEach(child => {
            if (Math.random() < randomFrequency) {
                child.visible = !child.visible;
            }
            });
        }
    });

    return <group ref={groupRef}>{children}</group>;
  };

export default FlickeringEffect;


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
