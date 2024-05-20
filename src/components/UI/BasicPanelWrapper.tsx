export const BasicPanelWrapper = ({
  children,
  titleText = "",
  width = "w-48",
  height = "h-fit",
  styles = "",
  opacity = 1,
  augUi = "border br-clip --aug-border-bg",
}: {
  children: React.ReactNode;
  titleText?: string;
  width?: string;
  height?: string;
  styles?: string;
  opacity?: number;
  augUi?: string;
  list?: boolean;
}) => {
  // console.log(titleText, opacity);

  return (
    <div
      className={`${styles} ${height} ${width} relative text-left text-xs bg-neutral-900/50 p-0 aug-border-yellow-500`}
      style={{ opacity: opacity }}
      data-augmented-ui={`${augUi}`}
    >
      <p className="orbitron w-full h-fit px-1 bg-uilines text-neutral-900 select-none">{titleText}</p>
      <div className="scrollbar w-full h-full p-1 text-uitext">{children}</div>
    </div>
  );
};
