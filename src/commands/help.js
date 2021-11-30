const fs = require("fs");
const path = require("path");

module.exports = {
	description: "Show command List",
	async execute(msg, args, client) {
		const commandDir = fs.readdirSync(path.join(__dirname)).filter((f) => f.endsWith(".js"));
		let commandList = [];
		commandDir.forEach((f) => {
			commandList.push({
				name: f.split(".js")[0],
				desc: require(`./${f}`),
			});
		});

		let messageTitle = "*Commands List*\n\n";
		let Commands = [];
		commandList.forEach((c) => {
			Commands.push(`➡️ ${process.env.PREFIX}${c.name} - ${c.desc.description}`);
		});

		Commands = Commands.join("\n");
		messageTitle = messageTitle + Commands;
		return client.sendMessage(msg.from, messageTitle);
	},
};
