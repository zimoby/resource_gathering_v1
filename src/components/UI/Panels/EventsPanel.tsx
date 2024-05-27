import { useListAppearing } from "../../../effects/ListAppearing";
import { useGameStore } from "../../../store/store";
import { BasicPanelWrapper } from "../BasicPanelWrapper";
import { animated } from "@react-spring/web";

export const EventsPanel = () => {
  const opacity = useGameStore(
    (state) => state.uiPanelsState.eventsPanel.opacity,
  );
  const eventsLog = useGameStore((state) => state.eventsLog);

  const transitions = useListAppearing(eventsLog);

  return (
    <BasicPanelWrapper
      height="h-32"
      width="w-64"
      titleText="Events:"
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
