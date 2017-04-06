exports.run = function(client, message, args) {
	var choices = args[0].split(',');
	if(choices.length > 1) {
		var chosenOne = choices[Math.floor(Math.random() * choices.length)];
		message.channel.sendMessage(`I choose you: ${chosenOne.trim()}`);
	} else {
		message.channel.sendMessage('Please supply at least 2 choices.');
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['ch'],
	permLevel: 0
};

exports.help = {
	name: 'choose',
	description: 'Supply a comma seperated list with no spaces. Ex. 1,10.20. The bot will choose for you',
	usage: 'choose'
};
