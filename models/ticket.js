const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
	id: {
		type: Number,
		required: true
	},
	owner: {
		type: String,
		required: true
	}
}, {timestamps: true});

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
