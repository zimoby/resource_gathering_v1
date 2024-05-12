
export const BasicPanelWrapper = ({
  children, titleText = "", width = "w-52", opacity = 1,
}: {
  children: React.ReactNode;
  titleText?: string;
  width?: string;
  opacity?: number;
}) => {

  // console.log(titleText, opacity);
  
  return (
    <div
      className={` h-fit ${width} text-left text-xs border border-white/80`}
      style={{ opacity: opacity }}
    >
      <p className="w-full h-fit px-1 bg-neutral-200 text-neutral-900">{titleText}</p>
      <div className="scrollbar w-full h-full p-1">{children}</div>
    </div>
)};
