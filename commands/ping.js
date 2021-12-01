module.exports = {
	description: "Test command",
	async execute(msg, args) {
		// Using Message Reply
		return msg.reply("Pong!");

		// Using Send Message
		// return client.sendMessage(msg.from, "Pong!")
	},
};
