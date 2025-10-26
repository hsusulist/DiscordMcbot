import BotConfigCard from '../BotConfigCard';

export default function BotConfigCardExample() {
  return (
    <BotConfigCard 
      initialToken="MTIzNDU2Nzg5MDEyMzQ1Njc4OTAuAbCdEf.XyZ123"
      isConnected={true}
      onSave={(token) => console.log('Token saved:', token)}
    />
  );
}
