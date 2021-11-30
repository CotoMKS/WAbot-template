const fs = require("fs");
const path = require("path");

module.exports = {
	description: "Command with subcommand",
	async execute(msg, args, client) {
		// Search for subcommand file in subcommand directory
		// Make sure your subcommand directory has the same name as the command file
		const commands_name = path.basename(__filename).split(".js")[0];
		const subcommands_dir = fs.readdirSync(path.join(__dirname, commands_name)).filter((f) => f.endsWith(".js"));
		let subcommands_list = [];
		subcommands_dir.forEach((sc) => {
			subcommands_list.push({
				name: sc.split(".js")[0],
				desc: require(`./${commands_name}/${sc}`),
				execute: require(`./${commands_name}/${sc}`),
			});
		});

		let subcommands_name = args[0];

		const SubCommandsHelp = () => {
			let SubCommandsList = [];
			subcommands_list.forEach((sc) => {
				SubCommandsList.push(`➡️ ${process.env.PREFIX}${commands_name} ${sc.name} - _${sc.desc.description}_`);
			});

			SubCommandsList = SubCommandsList.join("\n");
			return SubCommandsList;
		};

		if (!subcommands_name) {
			let message = "*Sub Command List*\n\n";
			message = message + SubCommandsHelp();
			return client.sendMessage(msg.from, message);
		} else {
			subcommands_name = subcommands_name.toLowerCase();
			const subCommands = subcommands_list.find((sc) => sc.name == subcommands_name);

			if (!subCommands) {
				let message = "*Sub Command List*\n\n";
				message = message + SubCommandsHelp();
				return client.sendMessage(msg.from, message);
			}

			try {
				await subCommands.execute.execute(msg, args, client);
			} catch (e) {
				console.error(e);
				msg.reply(`Error while executing command!\n\n_Reason: ${e}_`);
			}
		}
	},
};
