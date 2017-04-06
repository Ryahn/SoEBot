module.exports = member => {
	let guild = member.guild;
	guild.channels.get(guild.id).sendMessage('Welcome ' + member.username + '. Please join #newcomers and use !verify patreonemail.');
	guild.channels.get(guild.id).sendMessage('Besure to replace patreonemail wiht your email you use on patreon!');
	guild.channels.get(guild.id).sendMessage('Once you are verified, you will not be able to see #test channel any more.');
};
