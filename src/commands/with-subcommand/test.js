module.exports = {
	description: "Subcommand example",
	async execute(msg, args, client) {
		return msg.reply("_This is a subcommand_");
	},
};
