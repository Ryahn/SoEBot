exports.run = function(client, message, args) {
	var eightBallAnswers = ['it is certain', 'it is decidedly so', 'without a doubt', 'yes, definitely', 'you may rely on it',
		'as I see it, yes', 'most likely', 'outlook good', 'yes', 'signs point to yes', 'reply hazy try again', 'ask again later',
		'better not tell you now', 'cannot predict now', 'concentrate and try again', 'don\'t count on it', 'my reply is no', 'my sources say no',
		'very doubtful', 'lol no', 'no way', 'As If', 'Ask Me If I Care', 'Dumb Question Ask Another', 'Forget About It', 'Get A Clue', 'In Your Dreams', 'Not',
		'Not A Chance', 'Obviously', 'Oh Please', 'Sure', 'That\'s Ridiculous', 'Well Maybe', 'What Do You Think?', 'Whatever', 'Who Cares?', 'Yeah And I\'m The Pope',
		'Yeah Right', 'You Wish', 'You\'ve Got To Be Kidding...','You may not be gay, but $5 is $5'];

	var answer = eightBallAnswers[Math.floor(Math.random() * eightBallAnswers.length)];
	message.channel.sendMessage(answer + '.');
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['8ball','8b'],
	permLevel: 0
};

exports.help = {
	name: 'eightball',
	description: 'Gives random eight ball answers',
	usage: 'eightball, 8ball, 8b'
};
