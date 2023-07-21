const { SlashCommandBuilder } = require('@discordjs/builders');
const Server = require("../models/server");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("setup")
		.setDescription("Set up ReportMail for the server."),
	async execute(interaction, args, Discord) {
		await interaction.reply("Sorry but this commmand is not available yet. Please come back later!");
		return;
		await interaction.reply({ content: "Please wait while we're registering the server..." });
		// fill the code for setting up nofifyChannel here
		const notifyChannel = null;
		const server = new Server({
			guildId: interaction.guildId,
			notifyChannel: notifyChannel,
			tickets: []
		});
	}
}
