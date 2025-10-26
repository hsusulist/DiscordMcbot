import MonitoringControls from '../MonitoringControls';

export default function MonitoringControlsExample() {
  return (
    <MonitoringControls 
      isMonitoring={true}
      onModeChange={(mode) => console.log('Mode changed:', mode)}
      onStart={() => console.log('Started')}
      onStop={() => console.log('Stopped')}
    />
  );
}
