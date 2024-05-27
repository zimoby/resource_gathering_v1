import { animated } from "@react-spring/web";
import { useGameStore } from "../../../store/store";
import { BasicPanelWrapper } from "../BasicPanelWrapper";
import { useListAppearing } from "../../../effects/ListAppearing";

export const LogsPanel = () => {
  const opacity = useGameStore(
    (state) => state.uiPanelsState.logsPanel.opacity,
  );
  const logs = useGameStore((state) => state.logs);

  const transitions = useListAppearing(logs);

  return (
    <BasicPanelWrapper
      height="h-32"
      width="w-64"
      titleText="Logs:"
      opacity={opacity}
    >
      {transitions((style, log: { id: string; text: string }) => (
        <animated.div
          key={log.id}
          style={style}
          onClick={() => useGameStore.setState({ message: log.text })}
        >
          <div className="list-selecting">{log.text}</div>
        </animated.div>
      ))}
    </BasicPanelWrapper>
  );
};
