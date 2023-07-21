const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
	guildId: {
		type: String,
		required: true
	},
	notifyChannel: {
		type: String,
		required: true
	},
	tickets: {
		type: [Object],
		required: true
		/*
		Ticket object structure:
		id: {
			type: Number,
			required: true
		},
		owner: {
			type: String,
			required: true
		}
		*/
	}
}, {timestamps: true});

const Server = mongoose.model("Server", serverSchema);
module.exports = Server;
