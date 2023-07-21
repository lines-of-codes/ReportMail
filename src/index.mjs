import Discord, { Client, Collection, GatewayIntentBits } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import mongoose from "mongoose";
import { readdirSync } from "fs";
import dotenv from "dotenv";

dotenv.config();
const commands = [];
const bot = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages,
	],
	partials: ["GUILD_MEMBERS", "MESSAGE", "CHANNEL", "REACTION", "USER"],
});

// MongoDB username password
// reportmailbot mailbotworking
const connectURI =
	"mongodb+srv://reportmailbot:mailbotworking@reportmail0.sglpd.mongodb.net/?retryWrites=true&w=majority";

const mongoClient = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});
await mongoose.connect(connectURI, {useNewUrlParser: true, useUnifiedTopology: true});
console.log("Connected to MongoDB database.");

bot.commands = new Collection();
const commandFiles = readdirSync("./commands/").filter((file: String) =>
	file.endsWith(".js")
);

console.log("Loading commands...");
for (const file of commandFiles) {
	const command = await import(`./commands/${file}`);
	if (command.data) {
		bot.commands.set(command.data.name, command);
		commands.push(command.data.toJSON());
	} else {
		continue;
	}
}
const rest = new REST({ version: 9 }).setToken(process.env.TOKEN);

(async () => {
	await rest
		.put(Routes.applicationCommands(process.env.APPID), {
			body: commands,
		})
		.then(() => {
			console.log("Command registered successfully!");
		});
})();

console.log("Finished loading commands!");

bot.once("ready", () => {
	console.log("ReportMail is now online!");
	bot.user.setActivity("Reporting people :floosh: | /help");
});

bot.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) return;

	const command = bot.commands.get(interaction.commandName);
	if (!command) return;

	try {
		switch (interaction.commandName) {
			case "help":
				await command.execute(interaction, [], Discord);
				break;
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
		await interaction.reply({
			content: "There was an error while executing this command!",
			ephemeral: true,
		});
	}
});

function handleDM(message) {
	message.channel.send("DM handling is temporary closed, Sorry!");
}

bot.on("messageCreate", (message) => {
	if (message.channel.type == "dm") {
		handleDM(message);
	}
});

bot.login(process.env.TOKEN);
