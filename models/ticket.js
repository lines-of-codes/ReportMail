const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
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

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
