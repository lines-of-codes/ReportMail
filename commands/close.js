const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("close")
		.setDescription("Close a ticket."),
	async execute(message, args, Discord, Ticket, bot){
		if(message.author.hasPermission('ADMINISTRATOR')){
			if(!args[0]) {
				message.reply("Please provide the ID of the Ticket you wanted to delete.");
				return;
			}

			let reason = "Reason not specified.";
			if (args[1]) {
				reason = args.slice(1).join(" ");
			}

			if(!Number.isInteger(parseFloat(args[0], 10))){
				message.reply("Ticket ID must be a Whole number!");
				return;
			}

			let targetID = parseInt(args[0], 10);
			await Ticket.findOneAndDelete({ id: targetID }, function(err, doc) {
				if(err != null) {
					message.reply("There was an error deleting the ticket.")
					console.log(err);
					return;
				}
				if(doc == null) {
					const InfoEmbed = new Discord.MessageEmbed().setColor("#FF5555")
					.setTitle("Deletion failed").addFields(
						{name: "Possible cause", value: "The ticket ID may not exist or already closed."}
					);
					message.channel.send(InfoEmbed);
					return;
				}
				const InfoEmbed = new Discord.MessageEmbed().setColor("#FF5555")
				.setTitle("Ticket closed").addFields(
					{name: "By", value: `<@${message.author.id}>`},
					{name: "Reason", value: reason},
					{name: "Ticket ID", value: targetID}
				);
				message.channel.send(InfoEmbed);
				const user = message.guild.members.fetch(doc.owner).catch(() => null);

				if (!user) {
					message.channel.send(
						new Discord.MessageEmbed().setColor("#FF5555").setTitle("Notification failed")
						.addFields(
							{name: "What", value: "Failed to fetch user with the ID in the Ticket."},
							{name: "Why", value: "Possible causes are The user account is already deleted or the User already quits the Server."},
							{name: "Summary", value: "The Ticket is successfully closed. But the Notification is not sended to the Ticket author."}
						)
					)
				}

				user.send(
					new Discord.MessageEmbed().setColor("#FF5555")
					.setTitle("Ticket closed").setFooter(`Ticket ID: ${targetID}`)
				).catch(() => {
				   message.reply("The Ticket Author DMs is closed or has no mutual servers with the bot :(");
				});
			});
		} else {
			message.channel.send(
				new Discord.MessageEmbed().setColor("#FF5555")
				.setTitle("Access denied").setFooter("Administration permission required.")
			);
		}
	}
}
