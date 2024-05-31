import { useGameStore } from "../../../store/store";
import { BasicPanelWrapper } from "../BasicPanelWrapper";

export const ResourceDistributionPanel = () => {
  const collectedResources = useGameStore((state) => state.collectedResources);

  const totalResources = Object.values(collectedResources).reduce(
    (sum, count) => sum + count,
    0,
  );

  const resourcePercentages = Object.entries(collectedResources).map(
    ([resource, count]) => {
      const percentage =
        totalResources > 0 ? (count / totalResources) * 100 : 0;
      return { resource, percentage };
    },
  );

  return (
    <BasicPanelWrapper titleText="Resource Distribution">
      {resourcePercentages.map(({ resource, percentage }) => (
        <div key={resource} className="flex justify-between">
          <span>{resource}</span>
          <span>{percentage.toFixed(2)}%</span>
        </div>
      ))}
    </BasicPanelWrapper>
  );
};

export const BeaconManagementPanel = () => {
  const beacons = useGameStore((state) => state.beacons);

  const handleRemoveBeacon = (beaconId: string) => {
    useGameStore.setState((state) => ({
      beacons: state.beacons.filter((beacon) => beacon.id !== beaconId),
    }));
  };

  return (
    <BasicPanelWrapper titleText="Beacon Management">
      {beacons.map((beacon) => (
        <div key={beacon.id} className="flex justify-between items-center">
          <span>Beacon {beacon.id}</span>
          <div>
            <button onClick={() => handleRemoveBeacon(beacon.id)}>
              Remove
            </button>
          </div>
        </div>
      ))}
    </BasicPanelWrapper>
  );
};

export const ResourceExtractionPanel = () => {
  const extractionMethods = [
    { id: 1, name: "Surface Mining", time: 30, energyCost: 100 },
    { id: 2, name: "Deep Drilling", time: 60, energyCost: 200 },
    { id: 3, name: "Laser Extraction", time: 45, energyCost: 150 },
  ];

  return (
    <BasicPanelWrapper titleText="Resource Extraction">
      {extractionMethods.map((method) => (
        <div key={method.id} className="flex justify-between items-center mb-2">
          <span>{method.name}</span>
          <div>
            <span>Time: {method.time}s</span>
            <span>Energy: {method.energyCost}</span>
          </div>
        </div>
      ))}
    </BasicPanelWrapper>
  );
};
