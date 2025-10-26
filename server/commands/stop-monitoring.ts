import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { storage } from "../storage";

export const data = new SlashCommandBuilder()
  .setName("stop-monitoring")
  .setDescription("Stop auto-monitoring your Minecraft server");

export async function execute(
  interaction: ChatInputCommandInteraction,
  stopMonitoring: (guildId: string) => void
) {
  const guildId = interaction.guildId;
  
  if (!guildId) {
    await interaction.reply({
      content: "This command can only be used in a server!",
      ephemeral: true,
    });
    return;
  }

  const config = await storage.getServerConfig(guildId);

  if (!config) {
    await interaction.reply({
      content: "No server configured! Use `/setup` to configure your server first.",
      ephemeral: true,
    });
    return;
  }

  if (!config.autoMonitor) {
    await interaction.reply({
      content: "Auto-monitoring is not currently active.",
      ephemeral: true,
    });
    return;
  }

  stopMonitoring(guildId);
  await storage.saveServerConfig({ ...config, autoMonitor: false });

  const embed = new EmbedBuilder()
    .setColor(0xed4245)
    .setTitle("⏸️ Monitoring Stopped")
    .setDescription(`Auto-monitoring has been disabled for **${config.ip}:${config.port}**`)
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
