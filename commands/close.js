module.exports = {
	name: "close",
	description: "Close a ticket.",
	execute(message, args, Discord){
		if(args[0] == undefined) {
			message.reply("Please provide the ID of the Ticket you wanted to delete.");
		}
		var query = {id: args[0]};
	}
}
