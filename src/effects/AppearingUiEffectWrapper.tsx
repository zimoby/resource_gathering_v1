import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store';

interface FlickeringHtmlEffectProps {
  children: React.ReactNode;
  disabled?: boolean;
  appearingOnly?: boolean;
  initialIntensity?: number;
  randomFrequency?: number;
  duration?: number;
  classStyles?: string;
}

const FlickeringHtmlEffect: React.FC<FlickeringHtmlEffectProps> = ({
  children,
  disabled = false,
  initialIntensity = 6,
  duration = 50,
  classStyles = ""
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const disableAnimations = useGameStore((state) => state.disableAnimations);

  useEffect(() => {
    const container = containerRef.current;
    if ((disabled || disableAnimations) && container) {
      container.childNodes.forEach((child) => {
        (child as HTMLElement).style.visibility = 'visible';
      });
      return;
    }
  }, [disableAnimations, disabled]);

  useEffect(() => {
    if (disabled || disableAnimations) {
      return;
    }

    const container = containerRef.current;
    if (container) {
      const timeouts = new Set<number>();
      
      container.childNodes.forEach((child) => {
        // console.log("useAppearingGlitchingEffect");
        let lastToggle = 0;
        for (let i = 0; i < initialIntensity; i++) {
          lastToggle += Math.random() * duration;
          timeouts.add(
            setTimeout(() => {
              (child as HTMLElement).style.visibility = (child as HTMLElement).style.visibility === 'hidden' ? 'visible' : 'hidden';
            }, lastToggle)
          );
        }
        (child as HTMLElement).style.visibility = 'visible';
      });

      return () => timeouts.forEach(clearTimeout);
    }
  }, [initialIntensity, duration, disabled, containerRef, disableAnimations]);

  return <div className={classStyles} ref={containerRef}>{children}</div>;
};

export default FlickeringHtmlEffect;
