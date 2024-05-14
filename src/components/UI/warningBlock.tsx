export const WarningBlock = () => {
    const blockSize = {x: 300, y: 100};
  
    return (
      <div
        className="absolute top-0 left-1/2 z-50 size-10"
        style={{
          width: blockSize.x + "px",
          height: blockSize.y + "px",
        }}
      >
        <div className="bg-red-500 text-white text-xs p-1 rounded-md">
          <div className="text-center">Warning!</div>
          <div className="text-center">This is a test version</div>
          <div className="text-center">Some features may not work</div>
        </div>
      </div>
    )
  }