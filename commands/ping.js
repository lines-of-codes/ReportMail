const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Check the letency."),
	async execute(message, args, Discord, client){
		message.channel.send("Calculating ping...").then(resultMessage => {
			const ping = resultMessage.createdTimestamp - message.createdTimestamp;

			const InfoEmbed = new Discord.MessageEmbed().setColor("#AAFFAA")
			.setTitle("Latency").addFields(
				{name: "Bot latency", value: ping + "ms"},
				{name: "API latency", value: client.ws.ping + "ms"}
			);
			message.channel.send(InfoEmbed);
		})
	}
}
