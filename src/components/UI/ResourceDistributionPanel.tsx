import { useGameStore } from "../../store";
import { BasicPanelWrapper } from "./BasicPanelWrapper";

export const ResourceDistributionPanel = () => {
  const collectedResources = useGameStore((state) => state.collectedResources);

  const totalResources = Object.values(collectedResources).reduce((sum, count) => sum + count, 0);

  const resourcePercentages = Object.entries(collectedResources).map(([resource, count]) => {
    const percentage = totalResources > 0 ? (count / totalResources) * 100 : 0;
    return { resource, percentage };
  });

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

// export const ScanProgressPanel = () => {
//   const mapParams = useGameStore((state) => state.mapParams);
//   const scannedChunks = useGameStore((state) => state.scannedChunks);

//   const totalChunks =
//     (mapParams.width / mapParams.resolution) * (mapParams.depth / mapParams.resolution);
//   const scanPercentage = (scannedChunks / totalChunks) * 100;

//   return (
//     <BasicPanelWrapper titleText="Scan Progress" width="w-64">
//       <div className="flex justify-between">
//         <span>Scanned Chunks</span>
//         <span>{scannedChunks}</span>
//       </div>
//       <div className="flex justify-between">
//         <span>Total Chunks</span>
//         <span>{totalChunks}</span>
//       </div>
//       <div className="flex justify-between">
//         <span>Progress</span>
//         <span>{scanPercentage.toFixed(2)}%</span>
//       </div>
//     </BasicPanelWrapper>
//   );
// };

export const BeaconManagementPanel = () => {
  const beacons = useGameStore((state) => state.beacons);

  const handleRemoveBeacon = (beaconId: string) => {
    // Remove the beacon from the store
    useGameStore.setState((state) => ({
      beacons: state.beacons.filter((beacon) => beacon.id !== beaconId),
    }));
  };

  // const handleHighlightBeacon = (beaconId: string) => {
  //   // Highlight the beacon on the planet's surface
  //   // Implement the highlighting logic based on your requirements
  // };

  return (
    <BasicPanelWrapper titleText="Beacon Management" >
      {beacons.map((beacon) => (
        <div key={beacon.id} className="flex justify-between items-center">
          <span>Beacon {beacon.id}</span>
          <div>
            {/* <button onClick={() => handleHighlightBeacon(beacon.id)}>Highlight</button> */}
            <button onClick={() => handleRemoveBeacon(beacon.id)}>Remove</button>
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

  // const handleStartExtraction = (methodId: number) => {
  //   // Initiate the resource extraction process based on the selected method
  //   // Implement the extraction logic based on your requirements
  // };

  return (
    <BasicPanelWrapper titleText="Resource Extraction">
      {extractionMethods.map((method) => (
        <div key={method.id} className="flex justify-between items-center mb-2">
          <span>{method.name}</span>
          <div>
            <span>Time: {method.time}s</span>
            <span>Energy: {method.energyCost}</span>
            {/* <button onClick={() => handleStartExtraction(method.id)}>Start</button> */}
          </div>
        </div>
      ))}
    </BasicPanelWrapper>
  );
};

export const WarningPanel = () => {
  // const warnings = useGameStore((state) => state.warnings);
	const eventsLog = useGameStore((state) => state.eventsLog);

  return (
    <BasicPanelWrapper titleText="Warnings" width="w-64">
      {eventsLog.map((warning, index) => (
        <div key={index} className="mb-2 p-2 rounded bg-red-500 text-white">
          <div className="flex items-center">
            <span className="mr-2">⚠️</span>
            {/* <span className="font-bold">{warning.type}</span> */}
          </div>
          <p>{warning}</p>
        </div>
      ))}
      {eventsLog.length === 0 && (
        <div className="text-center text-green-500">No warnings at the moment.</div>
      )}
    </BasicPanelWrapper>
  );
};