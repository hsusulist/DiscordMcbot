import ServerStatusCard from '../ServerStatusCard';

export default function ServerStatusCardExample() {
  return (
    <ServerStatusCard 
      ip="play.hypixel.net"
      port="25565"
      status="online"
      lastChecked={new Date()}
    />
  );
}
