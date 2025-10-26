import PlayerMonitorCard from '../PlayerMonitorCard';

export default function PlayerMonitorCardExample() {
  return (
    <PlayerMonitorCard 
      playerCount={15}
      maxPlayers={20}
      isRefreshing={false}
      onRefresh={() => console.log('Refreshing...')}
    />
  );
}
