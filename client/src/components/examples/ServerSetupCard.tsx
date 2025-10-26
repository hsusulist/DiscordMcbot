import ServerSetupCard from '../ServerSetupCard';

export default function ServerSetupCardExample() {
  return (
    <ServerSetupCard 
      initialIp="play.hypixel.net"
      initialPort="25565"
      onSave={(ip, port) => console.log('Server configured:', ip, port)}
    />
  );
}
