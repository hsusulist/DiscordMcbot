import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { storage } from "../storage";

export const data = new SlashCommandBuilder()
  .setName("player-list")
  .setDescription("Show the list of online players");

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

  if (!status || status.status === "offline") {
    await interaction.reply({
      content: "Server is offline or hasn't been checked yet. Use `/check-server` first.",
      ephemeral: true,
    });
    return;
  }

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle("👥 Online Players")
    .addFields(
      { name: "Server", value: `\`${config.ip}:${config.port}\``, inline: false },
      { 
        name: "Player Count", 
        value: `${status.playerCount || 0}/${status.maxPlayers || 0}`, 
        inline: true 
      }
    );

  if (status.playerNames && status.playerNames.length > 0) {
    const playerList = status.playerNames.map((name, i) => `${i + 1}. ${name}`).join("\n");
    embed.addFields({
      name: "Players Online",
      value: playerList.length > 1024 ? playerList.substring(0, 1021) + "..." : playerList,
      inline: false,
    });
  } else if (status.playerCount === 0) {
    embed.addFields({
      name: "Players Online",
      value: "No players currently online",
      inline: false,
    });
  } else {
    embed.addFields({
      name: "Players Online",
      value: `${status.playerCount} player(s) online (names not available)`,
      inline: false,
    });
  }

  embed.setFooter({ text: `Last checked` })
    .setTimestamp(status.lastChecked);

  await interaction.reply({ embeds: [embed] });
}
