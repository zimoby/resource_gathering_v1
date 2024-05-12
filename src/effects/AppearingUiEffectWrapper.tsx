import React, { useEffect, useRef } from 'react';

interface FlickeringEffectProps {
  children: React.ReactNode;
  disabled?: boolean;
  appearingOnly?: boolean;
  initialIntensity?: number;
  randomFrequency?: number;
  duration?: number;
}

const FlickeringEffect: React.FC<FlickeringEffectProps> = ({
  children,
  disabled = false,
  initialIntensity = 6,
  duration = 50,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (disabled && container) {
      container.childNodes.forEach((child) => {
        (child as HTMLElement).style.visibility = 'visible';
      });
      return;
    }
  }, [disabled]);

  useEffect(() => {
    if (disabled) {
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
  }, [initialIntensity, duration, disabled, containerRef]);

  return <div ref={containerRef}>{children}</div>;
};

export default FlickeringEffect;
