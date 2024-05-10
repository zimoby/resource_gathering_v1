import { useEffect, useState } from "react";

interface TypingTextProps {
  text: string;
  speed?: number;
}

const TypingText: React.FC<TypingTextProps> = ({ text, speed = 20 }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    setDisplayText(""); // Reset displayText to an empty string when text prop changes

    let currentIndex = -1;
    const typingInterval = setInterval(() => {
      if (currentIndex < text.length - 1) {
          currentIndex++;
        setDisplayText((prevText) => prevText + text[currentIndex]);
      } else {
        clearInterval(typingInterval);
      }
    }, (text.length / 20) * speed);

    return () => {
      clearInterval(typingInterval);
    };
  }, [text, speed]);

  return <p className="w-fit h-fit">{displayText}</p>;
};

export default TypingText;