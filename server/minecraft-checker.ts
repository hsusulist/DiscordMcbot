import { status } from "minecraft-server-util";
import type { ServerStatus } from "@shared/schema";

export interface MinecraftServerInfo {
  online: boolean;
  playerCount: number;
  maxPlayers: number;
  version?: string;
  motd?: string;
  playerNames?: string[];
}

export async function checkMinecraftServer(
  ip: string,
  port: number = 25565
): Promise<MinecraftServerInfo> {
  try {
    const result = await status(ip, port, {
      timeout: 5000,
    });

    const playerNames = result.players.sample 
      ? result.players.sample.map((player: any) => player.name)
      : [];

    return {
      online: true,
      playerCount: result.players.online,
      maxPlayers: result.players.max,
      version: result.version.name,
      motd: result.motd.clean,
      playerNames,
    };
  } catch (error) {
    console.error(`Failed to check server ${ip}:${port}:`, error);
    return {
      online: false,
      playerCount: 0,
      maxPlayers: 0,
      playerNames: [],
    };
  }
}

export function createServerStatus(
  guildId: string,
  serverInfo: MinecraftServerInfo
): ServerStatus {
  return {
    guildId,
    status: serverInfo.online ? "online" : "offline",
    playerCount: serverInfo.playerCount,
    maxPlayers: serverInfo.maxPlayers,
    version: serverInfo.version,
    motd: serverInfo.motd,
    playerNames: serverInfo.playerNames,
    lastChecked: new Date(),
  };
}
