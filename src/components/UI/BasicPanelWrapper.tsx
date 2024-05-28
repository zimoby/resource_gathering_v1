import { ModalName } from "../../store/gameStateSlice";
import { useGameStore } from "../../store/store";

export const BasicPanelWrapper = ({
  children,
  titleText = "",
  width = "w-48",
  height = "h-fit",
  styles = "",
  opacity = 1,
  augUi = "border br-clip --aug-border-bg",
  titleModalAction,
}: {
  children: React.ReactNode;
  titleText?: string;
  width?: string;
  height?: string;
  styles?: string;
  opacity?: number;
  augUi?: string;
  list?: boolean;
  titleModalAction?: ModalName;
}) => {
  const toggleModal = useGameStore((state) => state.toggleModal);

  const titleAction = () => {
    if (titleModalAction !== undefined) {

      toggleModal(titleModalAction);
    }
    //   // if titleModal is defined, call it
    //   if (titleModalAction) {
    //     titleModalAction();
    //   }
  };

  return (
    <div
      className={`${styles} ${height} ${width} overflow-hidden relative text-left text-xs bg-neutral-900/50 p-0 aug-border-yellow-500`}
      style={{ opacity: opacity }}
      data-augmented-ui={`${augUi}`}
    >
      <button
        className={`orbitron w-full h-fit flex justify-start items-center px-1 bg-uilines text-neutral-900 select-none ${titleModalAction === undefined ? "cursor-default" : "cursor-pointer hover:bg-neutral-900 hover:text-uitext"}`}
        onClick={titleAction}
      >
        {titleText}
      </button>
      <div className="scrollbar w-full h-full p-1 text-uitext">{children}</div>
    </div>
  );
};
