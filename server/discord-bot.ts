import {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { storage } from "./storage";
import { checkMinecraftServer, createServerStatus } from "./minecraft-checker";
import { serverConfigSchema } from "@shared/schema";

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

    const commands = [
      new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Configure your Minecraft server")
        .addStringOption((option) =>
          option
            .setName("ip")
            .setDescription("Server IP address")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("port")
            .setDescription("Server port (default: 25565)")
            .setRequired(false)
        ),

      new SlashCommandBuilder()
        .setName("ip")
        .setDescription("Display configured server IP and port"),

      new SlashCommandBuilder()
        .setName("check-server")
        .setDescription("Check server status")
        .addStringOption((option) =>
          option
            .setName("mode")
            .setDescription("Check mode")
            .setRequired(true)
            .addChoices(
              { name: "One-time check", value: "once" },
              { name: "Auto-monitor (every 2 minutes)", value: "always" }
            )
        ),
    ];

    const rest = new REST().setToken(this.token);

    try {
      console.log("Registering Discord slash commands...");
      await rest.put(Routes.applicationCommands(this.client.user.id), {
        body: commands.map((cmd) => cmd.toJSON()),
      });
      console.log("Discord commands registered successfully");
    } catch (error) {
      console.error("Failed to register commands:", error);
    }
  }

  private async handleCommand(interaction: ChatInputCommandInteraction) {
    const { commandName, guildId } = interaction;

    if (!guildId) {
      await interaction.reply({
        content: "This command can only be used in a server!",
        ephemeral: true,
      });
      return;
    }

    try {
      switch (commandName) {
        case "setup":
          await this.handleSetup(interaction, guildId);
          break;
        case "ip":
          await this.handleIp(interaction, guildId);
          break;
        case "check-server":
          await this.handleCheckServer(interaction, guildId);
          break;
      }
    } catch (error) {
      console.error(`Error handling command ${commandName}:`, error);
      await interaction.reply({
        content: "An error occurred while processing your command.",
        ephemeral: true,
      });
    }
  }

  private async handleSetup(
    interaction: ChatInputCommandInteraction,
    guildId: string
  ) {
    const ip = interaction.options.getString("ip", true);
    const port = interaction.options.getString("port") || "25565";

    const validation = serverConfigSchema.safeParse({
      guildId,
      ip,
      port,
      autoMonitor: false,
    });

    if (!validation.success) {
      await interaction.reply({
        content: `Invalid configuration: ${validation.error.errors[0].message}`,
        ephemeral: true,
      });
      return;
    }

    await storage.saveServerConfig(validation.data);

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle("✅ Server Configured")
      .setDescription(`Successfully configured Minecraft server monitoring`)
      .addFields(
        { name: "IP Address", value: `\`${ip}\``, inline: true },
        { name: "Port", value: `\`${port}\``, inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }

  private async handleIp(
    interaction: ChatInputCommandInteraction,
    guildId: string
  ) {
    const config = await storage.getServerConfig(guildId);

    if (!config) {
      await interaction.reply({
        content:
          "No server configured! Use `/setup` to configure your server first.",
        ephemeral: true,
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle("📡 Server Information")
      .addFields(
        { name: "IP Address", value: `\`${config.ip}\``, inline: true },
        { name: "Port", value: `\`${config.port}\``, inline: true }
      )
      .setFooter({ text: `Full address: ${config.ip}:${config.port}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }

  private async handleCheckServer(
    interaction: ChatInputCommandInteraction,
    guildId: string
  ) {
    const mode = interaction.options.getString("mode", true) as "once" | "always";
    const config = await storage.getServerConfig(guildId);

    if (!config) {
      await interaction.reply({
        content:
          "No server configured! Use `/setup` to configure your server first.",
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply();

    if (mode === "once") {
      await this.performServerCheck(interaction, guildId, config.ip, parseInt(config.port));
    } else {
      // Start auto-monitoring
      await this.startMonitoring(guildId, config.ip, parseInt(config.port));
      await storage.saveServerConfig({ ...config, autoMonitor: true });

      const embed = new EmbedBuilder()
        .setColor(0x57f287)
        .setTitle("🔄 Auto-Monitoring Started")
        .setDescription(
          `I'll check **${config.ip}:${config.port}** every 2 minutes and report player counts.`
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    }
  }

  private async performServerCheck(
    interaction: ChatInputCommandInteraction,
    guildId: string,
    ip: string,
    port: number
  ) {
    const serverInfo = await checkMinecraftServer(ip, port);
    const serverStatus = createServerStatus(guildId, serverInfo);
    await storage.saveServerStatus(serverStatus);

    const embed = new EmbedBuilder()
      .setColor(serverInfo.online ? 0x57f287 : 0xed4245)
      .setTitle(serverInfo.online ? "🟢 Server Online" : "🔴 Server Offline")
      .addFields(
        { name: "IP", value: `\`${ip}:${port}\``, inline: true },
        {
          name: "Status",
          value: serverInfo.online ? "Online" : "Offline",
          inline: true,
        }
      );

    if (serverInfo.online) {
      embed.addFields(
        {
          name: "Players",
          value: `${serverInfo.playerCount}/${serverInfo.maxPlayers}`,
          inline: true,
        }
      );
      if (serverInfo.version) {
        embed.addFields({ name: "Version", value: serverInfo.version, inline: true });
      }
    }

    embed.setTimestamp();

    await interaction.editReply({ embeds: [embed] });
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
