const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Check the letency."),
	async execute(interaction, args, Discord, client){
		interaction.reply({ content: "Calculating ping...", fetchReply: true }).then(resultMessage => {
			const ping = resultMessage.createdTimestamp - interaction.createdTimestamp;

			const InfoEmbed = new Discord.MessageEmbed().setColor("#AAFFAA")
			.setTitle("Latency").addFields(
				{name: "Bot latency", value: ping + "ms"},
				{name: "API latency", value: client.ws.ping + "ms"}
			);
			interaction.editReply({embeds: [InfoEmbed]});
		});
	}
}
