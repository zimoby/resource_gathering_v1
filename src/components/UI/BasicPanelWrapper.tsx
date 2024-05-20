
export const BasicPanelWrapper = ({
  children, titleText = "", width = "w-48", height = "h-fit", opacity = 1,
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
      className={` ${height} ${width} overflow-hidden text-left text-xs border border-uilines`}
      style={{ opacity: opacity }}
    >
      <p className="w-full h-fit px-1 bg-uilines text-neutral-900 select-none">{titleText}</p>
      <div className="scrollbar w-full h-fit p-1 text-uitext">{children}</div>
    </div>
)};
