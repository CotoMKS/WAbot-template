require("dotenv").config();
const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

// Search for session config file
// If your are planning to host this template, please include the session.json file
// And make sure your Github repository was set to private
const SESSION_FILE_PATH = "./session.json";
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
	sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({ session: sessionCfg, puppeteer: { args: ["--no-sandbox"] } });

// Initialize Client
client.initialize();

// If there is no session config file, generate qr code
client.on("qr", (qr) => {
	qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
	if (process.env.MONGO_URI) {
		mongoose.connect(process.env.MONGO_URI, () => {
			console.log("Connected to Database!");
		});
	}

	console.log("Client is Ready!");
});

// If session config file exists, authenticate using credential provided in session config file
client.on("authenticated", (session) => {
	sessionCfg = session;
	fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
		if (err) {
			console.error(err);
		}
	});
});

// Command Handler
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const commandDir = fs.readdirSync(path.join(__dirname, "commands")).filter((f) => f.endsWith(".js"));
let commandList = [];
commandDir.forEach((f) => {
	commandList.push({
		name: f.split(".js")[0],
		execute: require(`./commands/${f}`),
	});
});

client.on("message", async (msg) => {
	const prefix = process.env.PREFIX;
	const message = msg.body.toLowerCase();

	const prefixRegex = new RegExp(`^(${escapeRegex(prefix)})\\s*`);
	if (!prefixRegex.test(message)) return;

	const [matchedPrefix] = message.match(prefixRegex);

	const args = message.slice(matchedPrefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = commandList.find((f) => f.name == commandName);

	if (!command) return;

	try {
		await command.execute.execute(msg, args, client);
	} catch (e) {
		console.error(e);
		msg.reply(`Error while executing command!\n\n_Reason: ${e}_`);
	}
});

console.clear();
console.log("Booting up Bot System....");
