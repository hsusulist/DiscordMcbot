import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Show all available commands and how to use them");

export async function execute(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle("📖 MC-Bot Help")
    .setDescription("Here are all the commands you can use with MC-Bot:")
    .addFields(
      {
        name: "/setup",
        value: "Configure your Minecraft server for monitoring\n```/setup ip:play.example.net port:25565```",
        inline: false,
      },
      {
        name: "/ip",
        value: "Display the configured server IP and port\n```/ip```",
        inline: false,
      },
      {
        name: "/check-server",
        value: "Check server status (one-time or auto-monitor)\n```/check-server mode:once```",
        inline: false,
      },
      {
        name: "/stop-monitoring",
        value: "Stop automatic monitoring of your server\n```/stop-monitoring```",
        inline: false,
      },
      {
        name: "/player-list",
        value: "Show the list of currently online players\n```/player-list```",
        inline: false,
      },
      {
        name: "/server-info",
        value: "Display detailed server information and stats\n```/server-info```",
        inline: false,
      },
      {
        name: "/help",
        value: "Show this help message\n```/help```",
        inline: false,
      }
    )
    .setFooter({ text: "MC-Bot - Minecraft Server Monitor" })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
