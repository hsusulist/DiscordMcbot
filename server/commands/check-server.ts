import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { storage } from "../storage";
import { checkMinecraftServer, createServerStatus } from "../minecraft-checker";

export const data = new SlashCommandBuilder()
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
  );

export async function execute(
  interaction: ChatInputCommandInteraction,
  startMonitoring: (guildId: string, ip: string, port: number) => Promise<void>
) {
  const guildId = interaction.guildId;
  
  if (!guildId) {
    await interaction.reply({
      content: "This command can only be used in a server!",
      ephemeral: true,
    });
    return;
  }

  const mode = interaction.options.getString("mode", true) as "once" | "always";
  const config = await storage.getServerConfig(guildId);

  if (!config) {
    await interaction.reply({
      content: "No server configured! Use `/setup` to configure your server first.",
      ephemeral: true,
    });
    return;
  }

  await interaction.deferReply();

  if (mode === "once") {
    await performServerCheck(interaction, guildId, config.ip, parseInt(config.port));
  } else {
    await startMonitoring(guildId, config.ip, parseInt(config.port));
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

async function performServerCheck(
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
    if (serverInfo.playerNames && serverInfo.playerNames.length > 0) {
      const playerList = serverInfo.playerNames.join(", ");
      embed.addFields({
        name: "Online Players",
        value: playerList.length > 1024 ? playerList.substring(0, 1021) + "..." : playerList,
        inline: false,
      });
    }
  }

  embed.setTimestamp();

  await interaction.editReply({ embeds: [embed] });
}
