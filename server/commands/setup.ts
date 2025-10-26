import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { storage } from "../storage";
import { serverConfigSchema } from "@shared/schema";

export const data = new SlashCommandBuilder()
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
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const guildId = interaction.guildId;
  
  if (!guildId) {
    await interaction.reply({
      content: "This command can only be used in a server!",
      ephemeral: true,
    });
    return;
  }

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
