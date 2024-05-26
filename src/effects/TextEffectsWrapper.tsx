import { useEffect, useState } from "react";

interface TypingTextProps {
  text: string;
  speed?: number;
}

const TypingText: React.FC<TypingTextProps> = ({ text, speed = 100 }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    setDisplayText("");

    let currentIndex = -1;
    const typingInterval = setInterval(
      () => {
        if (currentIndex < text.length - 1) {
          currentIndex++;
          setDisplayText((prevText) => prevText + text[currentIndex]);
        } else {
          clearInterval(typingInterval);
        }
      },
      (20 / text.length) * speed,
    );

    return () => {
      clearInterval(typingInterval);
    };
  }, [text, speed]);

  return <p className="w-fit h-fit">{displayText}</p>;
};

export default TypingText;
