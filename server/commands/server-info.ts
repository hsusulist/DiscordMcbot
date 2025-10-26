import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { storage } from "../storage";

export const data = new SlashCommandBuilder()
  .setName("server-info")
  .setDescription("Show detailed server information");

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
  const status = await storage.getServerStatus(guildId);

  if (!config) {
    await interaction.reply({
      content: "No server configured! Use `/setup` to configure your server first.",
      ephemeral: true,
    });
    return;
  }

  const embed = new EmbedBuilder()
    .setColor(status?.status === "online" ? 0x57f287 : 0xed4245)
    .setTitle("📊 Server Information")
    .setDescription(`Detailed information about **${config.ip}:${config.port}**`)
    .addFields(
      { name: "IP Address", value: `\`${config.ip}\``, inline: true },
      { name: "Port", value: `\`${config.port}\``, inline: true },
      { 
        name: "Auto-Monitoring", 
        value: config.autoMonitor ? "✅ Enabled" : "❌ Disabled", 
        inline: true 
      }
    );

  if (status) {
    const statusEmoji = status.status === "online" ? "🟢" : "🔴";
    embed.addFields(
      { 
        name: "Current Status", 
        value: `${statusEmoji} ${status.status.charAt(0).toUpperCase() + status.status.slice(1)}`, 
        inline: true 
      }
    );

    if (status.status === "online") {
      embed.addFields(
        { 
          name: "Players Online", 
          value: `${status.playerCount || 0}/${status.maxPlayers || 0}`, 
          inline: true 
        }
      );
      
      if (status.version) {
        embed.addFields({ name: "Version", value: status.version, inline: true });
      }
      
      if (status.motd) {
        embed.addFields({ 
          name: "Message of the Day", 
          value: status.motd.length > 1024 ? status.motd.substring(0, 1021) + "..." : status.motd, 
          inline: false 
        });
      }
    }

    embed.setFooter({ text: "Last checked" })
      .setTimestamp(status.lastChecked);
  } else {
    embed.addFields({
      name: "Status",
      value: "Not checked yet. Use `/check-server` to check the server status.",
      inline: false,
    });
  }

  await interaction.reply({ embeds: [embed] });
}
