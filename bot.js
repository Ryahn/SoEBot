const Discord = require('discord.js');
const client = new Discord.Client({
	forceFetchUsers: true,
	autoReconnect: true,
	disableEveryone: true,
});
const settings = require('./auth.json');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
require('./util/eventLoader')(client);

client.on('message', function (message)
{
	if (message.channel.isPrivate) {
		return;
	}
	if (message.everyoneMentioned) {
		return;
	}
	if (message.type === 'dm') {
		return;
	}
});

const log = message => {
	console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./commands/', (err, files) => {
	if (err) console.error(err);
	log(`Loading a total of ${files.length} commands.`);
	files.forEach(f => {
		let props = require(`./commands/${f}`);
		log(`Loading Command: ${props.help.name}. ✔️`);
		client.commands.set(props.help.name, props);
		props.conf.aliases.forEach(alias => {
			client.aliases.set(alias, props.help.name);
		});
	});
});

client.reload = command => {
	return new Promise((resolve, reject) => {
		try {
			delete require.cache[require.resolve(`./commands/${command}`)];
			let cmd = require(`./commands/${command}`);
			client.commands.delete(command);
			client.aliases.forEach((cmd, alias) => {
				if (cmd === command) client.aliases.delete(alias);
			});
			client.commands.set(command, cmd);
			cmd.conf.aliases.forEach(alias => {
				client.aliases.set(alias, cmd.help.name);
			});
			resolve();
		} catch (e) {
			reject(e);
		}
	});
};

client.elevation = message => {
    /* This function should resolve to an ELEVATION level which
       is then sent to the command handler for verification*/
	if(!message.guild) return;
	let permlvl = 0;
	let follower = message.guild.roles.find('name', settings.followerrolename);
	if (follower && message.member.roles.has(follower.id)) permlvl = 1;
	let player = message.guild.roles.find('name', settings.playerrolename);
	if (player && message.member.roles.has(player.id)) permlvl = 2;
	let overseer = message.guild.roles.find('name', settings.overseerrolename);
	if (overseer && message.member.roles.has(overseer.id)) permlvl = 3;
	let trusted = message.guild.roles.find('name', settings.trustedrolename);
	if (trusted && message.member.roles.has(trusted.id)) permlvl = 4;
	let overlord = message.guild.roles.find('name', settings.overlordrolename);
	if (overlord && message.member.roles.has(overlord.id)) permlvl = 5;
	if (message.author.id === settings.ownerid) permlvl = 5;
	return permlvl;
};

// var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
//
// client.on('warn', e => {
// 	console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
// });
//
// client.on('error', e => {
// 	console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
// });



client.login(settings.token);
