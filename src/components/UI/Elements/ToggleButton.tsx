import { MouseEventHandler } from "react";

export const ToggleButton = ({
  onClick,
  state,
  text,
}: {
  onClick: MouseEventHandler<HTMLButtonElement>;
  state: boolean;
  text: string;
}) => {
  return (
    <button
      className={`w-fit h-fit px-2 border text-sm ${
        state ? "bg-red-700" : ""
      }  hover:border-yellow-400  hover:bg-yellow-400 cursor-pointer uppercase  hover:text-neutral-900`}
      onClick={onClick}
    >
      {text}: {state ? "off" : "on"}
    </button>
  );
};
