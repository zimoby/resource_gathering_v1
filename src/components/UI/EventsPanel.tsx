import { useGameStore } from "../../store";
import { BasicPanelWrapper } from "./BasicPanelWrapper";

export const EventsPanel = () => {
  const opacity = useGameStore((state) => state.uiPanelsState.eventsPanel.opacity);
  const eventsLog = useGameStore((state) => state.eventsLog);

  return (
    <BasicPanelWrapper height="h-32" titleText="Events:" opacity={opacity}>
      {eventsLog.map((eventName, index) => (
        <div
          key={index}
          className="list-selecting"
          onClick={() => useGameStore.setState({ message: `Event: ${eventName}` })}
        >
          {eventName}
        </div>
      ))}
    </BasicPanelWrapper>
  );
};
