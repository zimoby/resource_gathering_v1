export const BasicPanelWrapper = ({
  children,
  titleText = "",
  width = "w-48",
  height = "h-fit",
  opacity = 1,
}: {
  children: React.ReactNode;
  titleText?: string;
  width?: string;
  height?: string;
  opacity?: number;
}) => {
  // console.log(titleText, opacity);

  return (
    <div
      className={`
    ${height} ${width} relative text-left text-xs bg-transparent p-0 aug-border-yellow-500`}
      style={{ opacity: opacity}}
      data-augmented-ui="border tl-clip br-clip --aug-border-bg"
    >
      <p className="w-full h-fit px-1 bg-uilines text-neutral-900 select-none">
        {titleText}
      </p>
      <div className="scrollbar w-full h-full p-1 text-uitext">{children}</div>
    </div>
  );
};
