module.exports = member => {
	let guild = member.guild;
	guild.channels.get(guild.id).sendMessage('Welcome new user. Thank you for pledging and feel free to ask all the questions you like <3');
};
