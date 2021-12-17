const Discord = require("discord.js");
const {Intents} = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const mongoose = require("mongoose");
const fs = require("fs");
const Server = require("./models/server");

require("dotenv").config();
const prefix = "{}";
const commands = []
const bot = new Discord.Client({
	intents: [
		Intents.FLAGS.GUILDS, 
		Intents.FLAGS.GUILD_MEMBERS, 
		Intents.FLAGS.GUILD_MESSAGES, 
		Intents.FLAGS.DIRECT_MESSAGES
	], 
	partials: [
		"GUILD_MEMBERS", 
		"MESSAGE", 
		"CHANNEL", 
		"REACTION", 
		"USER"
	]
})

// MongoDB username password
// reportmailbot mailbotworking
const connectURI = "mongodb+srv://reportmailbot:mailbotworking@reportmail0.sglpd.mongodb.net/reportmail?retryWrites=true&w=majority";
mongoose.connect(connectURI, {useNewUrlParser: true, useUnifiedTopology: true})
	.then((result) => console.log("Connected to MongoDB database."));

bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./commands/").filter(file => file.endsWith(".js"));

console.log("Loading commands...");
for(const file of commandFiles){
	const command = require(`./commands/${file}`);
	if(command.data) {
		bot.commands.set(command.data.name, command);
		commands.push(command.data.toJSON());
	} else {
		continue;
	}
}
const rest = new REST({ version: 9 }).setToken(process.env.TOKEN);

(async () => {
	await rest.put(
		Routes.applicationCommands(process.env.CLIENTID),
		{
			body: commands
		}
	).then(() =>{
		console.log("Command registered successfully!")
	})
})();

console.log("Finished loading commands!");

bot.once("ready", () => {
	console.log("ReportMail is now online!");
	bot.user.setActivity("Reporting people :floosh: | /help");
});

bot.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) return;

	const command = bot.commands.get(interaction.commandName);
	if(!command) return;

	try {
		switch(interaction.commandName) {
			case "help":
				await command.execute(interaction, [], Discord);
				break
			case "info":
				await command.execute(interaction, [], Discord);
				break;
			case "close":
				await command.execute(interaction, [], Discord, Server, bot);
				break;
			case "ping":
				await command.execute(interaction, [], Discord, bot);
				break;
			default:
				await command.execute(interaction, [], Discord, Server);
				break;
		}
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
	}
})

function handleDM(message) {
	message.channel.send("DM handling is temporary closed, Sorry!")
}

bot.on("messageCreate", message => {
	if(message.channel.type == "dm") {
		handleDM(message);
	}
});

bot.login(process.env.TOKEN);