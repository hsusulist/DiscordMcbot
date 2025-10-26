import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { storage } from "../storage";

export const data = new SlashCommandBuilder()
  .setName("ip")
  .setDescription("Display configured server IP and port");

export async function execute(interaction: ChatInputCommandInteraction) {
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
