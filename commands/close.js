const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("close")
		.setDescription("Close a ticket.")
		.addUserOption(option =>
			option.setName('id')
				.setDescription('The ID of the ticket to be closed')
				.setRequired(true)
		)
		.addUserOption(option =>
			option.setName('reason')
				.setDescription('The reason to close this ticket.')
				.setRequired(false)
		),
	async execute(interaction, args, Discord, Ticket, bot) {
		if(interaction.author.hasPermission('ADMINISTRATOR')) {
			if(!args[0]) {
				interaction.reply("Please provide the ID of the Ticket you wanted to delete.");
				return;
			}

			let reason = "Reason not specified.";
			if (args[1]) {
				reason = args.slice(1).join(" ");
			}

			if(!Number.isInteger(parseFloat(args[0], 10))){
				interaction.reply("Ticket ID must be a Whole number!");
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
					interaction.reply(InfoEmbed);
					return;
				}
				const InfoEmbed = new Discord.MessageEmbed().setColor("#FF5555")
				.setTitle("Ticket closed").addFields(
					{name: "By", value: `<@${message.author.id}>`},
					{name: "Reason", value: reason},
					{name: "Ticket ID", value: targetID}
				);
				interaction.reply(InfoEmbed);
				const user = message.guild.members.fetch(doc.owner).catch(() => null);

				if (!user) {
					interaction.reply(
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
			interaction.reply(
				new Discord.MessageEmbed().setColor("#FF5555")
				.setTitle("Access denied").setFooter("Administration permission required.")
			);
		}
	}
}
