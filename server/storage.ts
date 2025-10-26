import { type User, type InsertUser, type BotConfig, type ServerConfig, type InsertServerConfig, type ServerStatus } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods (existing)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Bot configuration methods
  getBotConfig(): Promise<BotConfig | undefined>;
  saveBotConfig(config: BotConfig): Promise<BotConfig>;
  
  // Server configuration methods
  getServerConfig(guildId: string): Promise<ServerConfig | undefined>;
  saveServerConfig(config: InsertServerConfig): Promise<ServerConfig>;
  getAllServerConfigs(): Promise<ServerConfig[]>;
  deleteServerConfig(guildId: string): Promise<boolean>;
  
  // Server status methods
  getServerStatus(guildId: string): Promise<ServerStatus | undefined>;
  saveServerStatus(status: ServerStatus): Promise<ServerStatus>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private botConfig: BotConfig | undefined;
  private serverConfigs: Map<string, ServerConfig>;
  private serverStatuses: Map<string, ServerStatus>;

  constructor() {
    this.users = new Map();
    this.serverConfigs = new Map();
    this.serverStatuses = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Bot configuration
  async getBotConfig(): Promise<BotConfig | undefined> {
    return this.botConfig;
  }

  async saveBotConfig(config: BotConfig): Promise<BotConfig> {
    this.botConfig = config;
    return config;
  }

  // Server configuration
  async getServerConfig(guildId: string): Promise<ServerConfig | undefined> {
    return this.serverConfigs.get(guildId);
  }

  async saveServerConfig(config: InsertServerConfig): Promise<ServerConfig> {
    const serverConfig: ServerConfig = { ...config };
    this.serverConfigs.set(config.guildId, serverConfig);
    return serverConfig;
  }

  async getAllServerConfigs(): Promise<ServerConfig[]> {
    return Array.from(this.serverConfigs.values());
  }

  async deleteServerConfig(guildId: string): Promise<boolean> {
    return this.serverConfigs.delete(guildId);
  }

  // Server status
  async getServerStatus(guildId: string): Promise<ServerStatus | undefined> {
    return this.serverStatuses.get(guildId);
  }

  async saveServerStatus(status: ServerStatus): Promise<ServerStatus> {
    this.serverStatuses.set(status.guildId, status);
    return status;
  }
}

export const storage = new MemStorage();
