const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("message")
		.setDescription("Send a message to the ticket author.")
		.addUserOption(option => 
			option.setName("id")
				.setDescription("The ID of the ticket to send the message to the author.")
				.setRequired(true)
		)
		.addUserOption(option =>
			option.setName("message")
				.setDescription("The reply message you wanted to send to the author of the ticket.")
				.setRequired(true)
		),
	async execute(message, args, Discord){
		
	}
}
