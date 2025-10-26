import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import DashboardHeader from "@/components/DashboardHeader";
import BotConfigCard from "@/components/BotConfigCard";
import ServerSetupCard from "@/components/ServerSetupCard";
import ServerStatusCard from "@/components/ServerStatusCard";
import PlayerMonitorCard from "@/components/PlayerMonitorCard";
import MonitoringControls from "@/components/MonitoringControls";
import type { ServerStatus, ServerConfig } from "@shared/schema";

interface BotStatus {
  configured: boolean;
  connected: boolean;
  username?: string;
}

export default function Dashboard() {
  const [monitoringMode, setMonitoringMode] = useState<"once" | "auto">("once");

  // Fetch bot status
  const { data: botStatus } = useQuery<BotStatus>({
    queryKey: ["/api/bot/status"],
    refetchInterval: 5000,
  });

  // Fetch server config
  const { data: serverConfig } = useQuery<ServerConfig | null>({
    queryKey: ["/api/server/config"],
  });

  // Fetch server status
  const { data: serverStatus, refetch: refetchStatus } = useQuery<ServerStatus | null>({
    queryKey: ["/api/server/status"],
    refetchInterval: serverConfig?.autoMonitor ? 10000 : false,
  });

  // Save bot token mutation
  const saveBotTokenMutation = useMutation({
    mutationFn: async (token: string) => {
      return apiRequest("POST", "/api/bot/config", { token });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bot/status"] });
    },
  });

  // Save server config mutation
  const saveServerConfigMutation = useMutation({
    mutationFn: async ({ ip, port }: { ip: string; port: string }) => {
      return apiRequest("POST", "/api/server/config", { ip, port, autoMonitor: false });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/server/config"] });
      checkServerMutation.mutate();
    },
  });

  // Check server mutation
  const checkServerMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/server/check");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/server/status"] });
    },
  });

  // Monitor control mutation
  const monitorMutation = useMutation({
    mutationFn: async (action: "start" | "stop") => {
      return apiRequest("POST", "/api/server/monitor", { action });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/server/config"] });
      if (monitoringMode === "auto") {
        checkServerMutation.mutate();
      }
    },
  });

  const handleBotTokenSave = async (token: string) => {
    await saveBotTokenMutation.mutateAsync(token);
  };

  const handleServerSetup = async (ip: string, port: string) => {
    await saveServerConfigMutation.mutateAsync({ ip, port });
  };

  const handleRefreshPlayers = () => {
    checkServerMutation.mutate();
  };

  const handleStartMonitoring = () => {
    if (monitoringMode === "once") {
      checkServerMutation.mutate();
    } else {
      monitorMutation.mutate("start");
    }
  };

  const handleStopMonitoring = () => {
    monitorMutation.mutate("stop");
  };

  const handleModeChange = (mode: "once" | "auto") => {
    setMonitoringMode(mode);
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
                isConnected={botStatus?.connected || false}
              />
              <ServerSetupCard 
                onSave={handleServerSetup}
                initialIp={serverConfig?.ip}
                initialPort={serverConfig?.port}
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
                ip={serverConfig?.ip || "Not configured"}
                port={serverConfig?.port || "25565"}
                status={serverStatus?.status || "offline"}
                lastChecked={serverStatus?.lastChecked ? new Date(serverStatus.lastChecked) : undefined}
              />
              <PlayerMonitorCard 
                playerCount={serverStatus?.playerCount || 0}
                maxPlayers={serverStatus?.maxPlayers || 20}
                onRefresh={handleRefreshPlayers}
                isRefreshing={checkServerMutation.isPending}
              />
            </div>
            <MonitoringControls 
              onStart={handleStartMonitoring}
              onStop={handleStopMonitoring}
              onModeChange={handleModeChange}
              isMonitoring={serverConfig?.autoMonitor || false}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
