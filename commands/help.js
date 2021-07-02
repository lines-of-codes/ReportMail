module.exports = {
	name: "help",
	description: "a Help command.",
	execute(message, args, Discord){
		function specificCommandEmbed(title, description) {
			const Embed = new Discord.MessageEmbed().setColor("#AAFFAA")
			.setTitle(title).setDescription(description)
			return Embed;
		}

		switch(args[0]) {
			case "close":
				message.channel.send(
					specificCommandEmbed("{}close {Ticket ID} [message]", "Close a Report ticket.")
					.addFields(
						{name: "Ticket ID", value: "The ID of the ticket you wanted to close."},
						{name: "message (Optional)", value: "The message you wanted to send to the Ticket author."}
					)
				);
				break;
			case "message":
				message.channel.send(
					specificCommandEmbed("{}message {Ticket ID} {message}")
					.addFields(
						{name: "Ticket ID", value: "The Ticket you wanted to send the message to."},
						{name: "message", value: "The message you wanted to send to the Ticket author."}
					)
				);
				break;
			default:
				const Embed = new Discord.MessageEmbed().setColor("#AAFFAA")
				.setTitle("Help").setDescription("a Place you can find some info about ReportMail.")
				.addFields(
					{name: "{}help {command name}", value: "Find info about a Specific command."},
					{name: "{}close {Ticket ID} [message]", value: "Close a Report Ticket"},
					{name: "{}message {Ticket ID} {message}", value: "Send message to the Ticket author."},
					{name: "{}info", value: "Show the info about this bot."},
					{name: "Note", value: "All commands (Except help) are only usable If the person has an Administration permission."}
				);
				message.channel.send(Embed);
				break;
		}
	}
}