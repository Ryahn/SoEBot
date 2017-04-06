exports.run = function(client, message, args) {
	if(args[0] != null) {
		let messagecount = parseInt(args.join(' '));
		message.channel.fetchMessages({
			limit: messagecount
		}).then(messages => message.channel.bulkDelete(messages));
	} else {
		message.channel.sendMessage('Please specify a number of message to remove.');
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: 4
};

exports.help = {
	name: 'purge',
	description: 'Purges X amount of messages from a given channel.',
	usage: 'purge <number>'
};
