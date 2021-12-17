const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("info")
		.setDescription("Check the bot information."),
	async execute(interaction, args, Discord){
		const InfoEmbed = new Discord.MessageEmbed().setColor("#AAFFAA")
		.setTitle("Information").setDescription("an Information about this bot.")
		.addFields(
			{name: "Version", value: "Version 0.1.0 Alpha"},
			{name: "Developer", value: "Satakun Utama"},
			{name: "Website", value: "Not available yet"}
		).setFooter("Copyrighted (c) 2021 S Universal group, All rights reserved.");
		interaction.reply({embeds: [InfoEmbed]});
	}
}
