
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
      className={` ${height} ${width} overflow-hidden text-left text-xs border border-white/80`}
      style={{ opacity: opacity }}
    >
      <p className="w-full h-fit px-1 bg-neutral-200 text-neutral-900">{titleText}</p>
      <div className="scrollbar w-full h-full p-1">{children}</div>
    </div>
)};
