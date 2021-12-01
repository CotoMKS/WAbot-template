module.exports = {
	description: "Subcommand example with argument",
	async execute(msg, args, client) {
		// If you want to use extra argument in your subcommand, you can take args[1] as your extra argument
		const other_args = args[1];

		// You can also join (" ") if you are planning to add argument that has (" ") on it
		// const nama_group = args.slice(1).join(" ")

		return msg.reply(`This is a Subcommand with extra argument`);
	},
};
