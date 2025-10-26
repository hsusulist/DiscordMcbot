import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  ChatInputCommandInteraction,
} from "discord.js";
import { storage } from "./storage";
import { checkMinecraftServer, createServerStatus } from "./minecraft-checker";
import { commands, getCommandsArray } from "./commands/index";

export class DiscordBot {
  private client: Client;
  private token: string;
  private monitoringIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor(token: string) {
    this.token = token;
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds],
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.client.once("ready", async () => {
      console.log(`Discord bot logged in as ${this.client.user?.tag}`);
      await this.registerCommands();
      await this.restoreMonitoring();
    });

    this.client.on("interactionCreate", async (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      await this.handleCommand(interaction);
    });
  }

  private async registerCommands() {
    if (!this.client.user) return;

    const commandsArray = getCommandsArray();
    const rest = new REST().setToken(this.token);

    try {
      console.log("Registering Discord slash commands...");
      await rest.put(Routes.applicationCommands(this.client.user.id), {
        body: commandsArray.map((cmd) => cmd.toJSON()),
      });
      console.log(`Discord commands registered successfully (${commandsArray.length} commands)`);
    } catch (error) {
      console.error("Failed to register commands:", error);
    }
  }

  private async handleCommand(interaction: ChatInputCommandInteraction) {
    const { commandName } = interaction;

    try {
      switch (commandName) {
        case "setup":
          await commands.setup.execute(interaction);
          break;
        case "ip":
          await commands.ip.execute(interaction);
          break;
        case "check-server":
          await commands["check-server"].execute(
            interaction,
            this.startMonitoring.bind(this)
          );
          break;
        case "stop-monitoring":
          await commands["stop-monitoring"].execute(
            interaction,
            this.stopMonitoring.bind(this)
          );
          break;
        case "player-list":
          await commands["player-list"].execute(interaction);
          break;
        case "server-info":
          await commands["server-info"].execute(interaction);
          break;
        case "help":
          await commands.help.execute(interaction);
          break;
        default:
          await interaction.reply({
            content: "Unknown command. Use `/help` to see all available commands.",
            ephemeral: true,
          });
      }
    } catch (error) {
      console.error(`Error handling command ${commandName}:`, error);
      
      const errorMessage = "An error occurred while processing your command.";
      
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ content: errorMessage });
      } else {
        await interaction.reply({
          content: errorMessage,
          ephemeral: true,
        });
      }
    }
  }

  private async startMonitoring(guildId: string, ip: string, port: number) {
    // Stop existing monitoring if any
    this.stopMonitoring(guildId);

    // Perform initial check
    const serverInfo = await checkMinecraftServer(ip, port);
    await storage.saveServerStatus(createServerStatus(guildId, serverInfo));

    // Start interval
    const interval = setInterval(async () => {
      try {
        const info = await checkMinecraftServer(ip, port);
        await storage.saveServerStatus(createServerStatus(guildId, info));
        console.log(
          `[Monitor ${guildId}] ${ip}:${port} - ${info.online ? "Online" : "Offline"} (${info.playerCount}/${info.maxPlayers})`
        );
      } catch (error) {
        console.error(`Monitoring error for ${guildId}:`, error);
      }
    }, 2 * 60 * 1000); // 2 minutes

    this.monitoringIntervals.set(guildId, interval);
  }

  private stopMonitoring(guildId: string) {
    const interval = this.monitoringIntervals.get(guildId);
    if (interval) {
      clearInterval(interval);
      this.monitoringIntervals.delete(guildId);
      console.log(`Stopped monitoring for guild ${guildId}`);
    }
  }

  private async restoreMonitoring() {
    // Restore auto-monitoring for servers that had it enabled
    const configs = await storage.getAllServerConfigs();
    for (const config of configs) {
      if (config.autoMonitor) {
        await this.startMonitoring(config.guildId, config.ip, parseInt(config.port));
        console.log(`Restored monitoring for guild ${config.guildId}`);
      }
    }
  }

  async start() {
    try {
      await this.client.login(this.token);
      console.log("Discord bot started successfully");
    } catch (error) {
      console.error("Failed to start Discord bot:", error);
      throw error;
    }
  }

  async stop() {
    // Stop all monitoring
    for (const guildId of Array.from(this.monitoringIntervals.keys())) {
      this.stopMonitoring(guildId);
    }
    await this.client.destroy();
    console.log("Discord bot stopped");
  }

  getClient() {
    return this.client;
  }
}

let botInstance: DiscordBot | null = null;

export async function startBot(token: string) {
  if (botInstance) {
    await botInstance.stop();
  }
  
  botInstance = new DiscordBot(token);
  await botInstance.start();
  return botInstance;
}

export async function stopBot() {
  if (botInstance) {
    await botInstance.stop();
    botInstance = null;
  }
}

export function getBotInstance() {
  return botInstance;
}
