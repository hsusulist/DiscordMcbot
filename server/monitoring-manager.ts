import { storage } from "./storage";
import { checkMinecraftServer, createServerStatus } from "./minecraft-checker";

class MonitoringManager {
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  async startMonitoring(guildId: string, ip: string, port: number) {
    // Stop existing monitoring if any
    this.stopMonitoring(guildId);

    // Perform initial check
    await this.performCheck(guildId, ip, port);

    // Start interval for 2-minute checks
    const interval = setInterval(async () => {
      await this.performCheck(guildId, ip, port);
    }, 2 * 60 * 1000); // 2 minutes

    this.intervals.set(guildId, interval);
    console.log(`Started monitoring for ${guildId}: ${ip}:${port}`);
  }

  stopMonitoring(guildId: string) {
    const interval = this.intervals.get(guildId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(guildId);
      console.log(`Stopped monitoring for ${guildId}`);
    }
  }

  private async performCheck(guildId: string, ip: string, port: number) {
    try {
      const serverInfo = await checkMinecraftServer(ip, port);
      const serverStatus = createServerStatus(guildId, serverInfo);
      await storage.saveServerStatus(serverStatus);
      console.log(
        `[Monitor ${guildId}] ${ip}:${port} - ${serverInfo.online ? "Online" : "Offline"} (${serverInfo.playerCount}/${serverInfo.maxPlayers})`
      );
    } catch (error) {
      console.error(`Monitoring error for ${guildId}:`, error);
    }
  }

  async restoreMonitoring() {
    // Restore monitoring for all servers with autoMonitor enabled
    const configs = await storage.getAllServerConfigs();
    for (const config of configs) {
      if (config.autoMonitor) {
        await this.startMonitoring(config.guildId, config.ip, parseInt(config.port));
      }
    }
  }

  stopAll() {
    for (const guildId of Array.from(this.intervals.keys())) {
      this.stopMonitoring(guildId);
    }
  }
}

export const monitoringManager = new MonitoringManager();
