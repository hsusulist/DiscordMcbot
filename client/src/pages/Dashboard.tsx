import { useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import BotConfigCard from "@/components/BotConfigCard";
import ServerSetupCard from "@/components/ServerSetupCard";
import ServerStatusCard from "@/components/ServerStatusCard";
import PlayerMonitorCard from "@/components/PlayerMonitorCard";
import MonitoringControls from "@/components/MonitoringControls";

export default function Dashboard() {
  const [isConnected, setIsConnected] = useState(false);
  const [serverIp, setServerIp] = useState("");
  const [serverPort, setServerPort] = useState("25565");
  const [serverStatus, setServerStatus] = useState<"online" | "offline" | "checking">("offline");
  const [lastChecked, setLastChecked] = useState<Date>();
  const [playerCount, setPlayerCount] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(20);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleBotTokenSave = (token: string) => {
    console.log("Bot token saved:", token.substring(0, 10) + "...");
    setIsConnected(true);
  };

  const handleServerSetup = (ip: string, port: string) => {
    console.log("Server configured:", ip, port);
    setServerIp(ip);
    setServerPort(port);
    checkServerOnce();
  };

  const checkServerOnce = async () => {
    setServerStatus("checking");
    await new Promise(resolve => setTimeout(resolve, 1500));
    setServerStatus("online");
    setPlayerCount(Math.floor(Math.random() * 15) + 1);
    setMaxPlayers(20);
    setLastChecked(new Date());
  };

  const handleRefreshPlayers = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPlayerCount(Math.floor(Math.random() * 15) + 1);
    setIsRefreshing(false);
    setLastChecked(new Date());
  };

  const handleStartMonitoring = () => {
    console.log("Starting monitoring...");
    setIsMonitoring(true);
    checkServerOnce();
  };

  const handleStopMonitoring = () => {
    console.log("Stopping monitoring...");
    setIsMonitoring(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-semibold">Configuration</h2>
              <p className="text-muted-foreground mt-1">Set up your bot and server connection</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <BotConfigCard 
                onSave={handleBotTokenSave}
                isConnected={isConnected}
              />
              <ServerSetupCard 
                onSave={handleServerSetup}
                initialPort="25565"
              />
            </div>
          </section>

          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-semibold">Monitoring</h2>
              <p className="text-muted-foreground mt-1">Track your server status and player activity</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <ServerStatusCard 
                ip={serverIp || "Not configured"}
                port={serverPort}
                status={serverStatus}
                lastChecked={lastChecked}
              />
              <PlayerMonitorCard 
                playerCount={playerCount}
                maxPlayers={maxPlayers}
                onRefresh={handleRefreshPlayers}
                isRefreshing={isRefreshing}
              />
            </div>
            <MonitoringControls 
              onStart={handleStartMonitoring}
              onStop={handleStopMonitoring}
              isMonitoring={isMonitoring}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
