const fs = require("fs");
const Discord = require("discord.js");
const mongoose = require("mongoose");
const Ticket = require("./models/ticket");
const bot = new Discord.Client();
const token = "ODYwMzY3MDMyMzYxMDI1NTM2.YN6NPQ.cddzLTGEi5BRcuI_fdqzUlp1q2w";
const prefix = "{}";

// MongoDB username password
// reportmailbot mailbotworking
const connectURI = "mongodb+srv://reportmailbot:mailbotworking@reportmail0.sglpd.mongodb.net/reportmail?retryWrites=true&w=majority";
mongoose.connect(connectURI, {useNewUrlParser: true, useUnifiedTopology: true})
	.then((result) => console.log("Connected to MongoDB database."));

bot.once("ready", () => {
	console.log("ReportMail is now online!");
})

bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for(const file of commandFiles){
	const command = require(`./commands/${file}`);

	bot.commands.set(command.name, command);
}

var ticketID = 0;
const cooldowns = new Map();

function handleDM(message) {
	if(!cooldowns.has("ticket")){
		cooldowns.set("ticket", new Discord.Collection());
	}

	const current_time = Date.now();
	const time_stamps = cooldowns.get("ticket");
	const cooldown_amount = 15000;

	if(time_stamps.has(message.author.id)){
		const expiration_time = time_stamps.get(message.author.id) + cooldown_amount;

		if(current_time < expiration_time){
			const time_left = (expiration_time - current_time) / 1000;
			return message.reply(`Hey! Please wait for ${time_left.toFixed(1)} second(s) before sending a Ticket again.`);
		}
	}

	time_stamps.set(message.author.id, current_time);
	setTimeout(() => time_stamps.delete(message.author.id), cooldown_amount)

	let embed = new Discord.MessageEmbed().setColor("#AAFFAA")
	.setTitle("Ticket created:").addFields(
		{name: "Content", value: message.content}
	).setFooter(`${message.author.username}#${message.author.discriminator}`);
	let attachment;
	message.attachments.forEach(element => {
		attachment = element;
	})
	if(attachment != null) {
		embed.setImage(attachment.url);
	}
	bot.channels.cache.get("860377230332395530").send(embed);
	// bot.channels.cache.get(message.channel.id).send(new Discord.MessageEmbed().setColor("#AAFFAA").setTitle("Ticket sent."))
	const ticket = new Ticket({
		id: ticketID,
		owner: message.channel.id
	});
	ticket.save().then(() => {
		message.channel.send(new Discord.MessageEmbed().setColor("#AAFFAA").setTitle("Ticket sent."));
		ticketID++;
	});
}

bot.on("message", message => {
	if(message.author.bot) return;
	if(message.channel.type == "dm" && !message.content.startsWith(prefix))
	{
		handleDM(message);
		return;
	}
	if(message.content.startsWith(prefix)) {
		const args = message.content.slice(prefix.length).split(" ");
		const command = args.shift().toLowerCase();

		let isValidCommand = false;

		switch(command) {
			case "help":
				isValidCommand = true;
				break;
			case "ping":
				isValidCommand = true;
				break;
			case "close":
				isValidCommand = true;
				break;
			case "info":
				isValidCommand = true;
				break;
			case "message":
				isValidCommand = true;
				break;
			default:
				message.channel.send("Command " + command + " does not exist!");
				break;
		}

		if(isValidCommand && !cooldowns.has(command)){
			cooldowns.set(command.name, new Discord.Collection());
		}

		if(!isValidCommand) return;

		const commandobj = bot.commands.get(command);

		try {
			if (command == "ping"){
				commandobj.execute(message, args, Discord, bot);
			} else {
				commandobj.execute(message, args, Discord);
			}
		} catch (err) {
			message.reply("There was an Error trying to execute this command!");
			console.log(err);
		}
	}
})

bot.login(token);
