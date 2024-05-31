import { useEffect } from "react";
import { useGameStore } from "../../../store/store";

export const AboutModal = () => {
  const showAboutModal = useGameStore((state) => state.showAboutModal);
  const updateStoreProperty = useGameStore(
    (state) => state.updateStoreProperty,
  );

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        updateStoreProperty("showAboutModal", false);
      }
    };

    if (showAboutModal) {
      window.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [showAboutModal, updateStoreProperty]);

  return (
    <div
      className="fixed w-full h-full flex justify-center items-center z-50 bg-black/50"
      style={{ display: showAboutModal ? "flex" : "none" }}
    >
      <div
        className="relative bg-black/80 w-96 h-fit flex flex-col border border-uilines aug-border-yellow-500"
        data-augmented-ui="border tl-2-clip-x br-2-clip-x --aug-border-bg"
      >
        <div className="absolute bottom-1.5 left-1.5 size-5 border-l-uilines border-b-uilines border-b-2 border-l-2" />
        <div className="flex justify-end items-center">
          <div
            className="flex justify-center items-center size-8 text-uitext cursor-pointer hover:bg-uilines hover:text-neutral-900"
            onClick={() => updateStoreProperty("showAboutModal", false)}
          >
            <div className="text-4xl rotate-45 text-center">+</div>
          </div>
        </div>
        <div className="orbitron w-full h-8 flex justify-center bg-uilines items-center text-neutral-900 text-2xl">
          About
        </div>
        <div className="w-full h-full flex flex-col p-7 pt-4 text-uitext leading-5 space-y-2">
          <div className="text-sm">
            <p>
              This game, created for the challenge &quot;Futuristic UI&quot;
              from Bruno Simon&apos;s{" "}
            </p>
            <a
              className="underline"
              href="https://threejs-journey.com"
              target="_blank"
              rel="noreferrer"
            >
              Three.js Journey
            </a>
            <p>course, focuses on gathering resources on unknown planets.</p>
          </div>
          <p className="">
            <a
              className="underline"
              href="https://github.com/zimoby/resource_gathering_v1"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </p>
          <p className="text-sm">
            The game is being developed by Denys Bondartsov.
          </p>
          <div className=" flex flex-row space-x-3">
            <a
              className="underline"
              href="https://zimoby.notion.site/"
              target="_blank"
              rel="noreferrer"
            >
              Notion
            </a>
            <a> | </a>
            <a
              className="underline"
              href="https://www.instagram.com/zimoby/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a> | </a>
            <a
              className="underline"
              href="https://x.com/ZimOby"
              target="_blank"
              rel="noreferrer"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
