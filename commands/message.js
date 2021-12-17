const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("message")
		.setDescription("Send a message to the ticket author."),
	async execute(message, args, Discord){
		
	}
}
