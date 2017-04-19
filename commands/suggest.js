const mysql2 = require('mysql');
const config = require('../auth.json');
const db2 = mysql2.createConnection({
	host: config.mysqlhost,
	user: config.mysqluser,
	password: config.mysqlpass,
	database: config.mysqldb
});
db2.connect();
exports.run = function(client, message, params) {
	if (!message.guild) {
		return;
	}
	let trustedRole = message.guild.roles.find('name', config.trustedrolename);
	let overlordRole = message.guild.roles.find('name', config.overlordrolename);


	let userid = message.author.id;
	let command = params[0];
	let type = params[1];
	let content = params.slice(2).join(' ');
	if(command == 'add') {
		db2.query(`SELECT cat_name FROM categories WHERE cat_name = '${type}' LIMIT 1`, function (err, rows) {
			if(rows[0] != null) {
				db2.query(`SELECT content FROM suggestions WHERE content = '${content}'`, function (err1, vrows) {
					if(vrows[0] != null) {
						if(`${vrows[0].content}` == `${content}`) {
							message.channel.sendMessage('Suggestion already exists.\nPlease do not submit duplicate suggestions.\nIf you are unsure, ask.');
						}
					} else {
						if(command == 'add') {
							db2.query(`INSERT INTO suggestions (userid, type, content) VALUES ('${userid}', '${type}', '${content}')`);
							db2.query('SELECT * FROM suggestions ORDER BY id DESC LIMIT 1', function (err2, srows) {
								let sid = srows[0].id;
								let ntype = srows[0].type;
								let ncontent = srows[0].content;
								client.fetchUser(`${srows[0].userid}`).then(function(result) {
									let nuser = result.username;
									message.guild.channels.get(`${config.adminchan}`).sendCode('asciidoc',`→::New Suggestion!::←\nID: ${sid}\nUser: ${nuser}\nType: ${ntype}\nContent: ${ncontent}`);
									message.guild.channels.get(`${message.channel.id}`).sendMessage('Suggestion recorded!');
								});
							});
						}
					}
				});
			} else {
				message.channel.sendMessage(`Type: ${type} is not a valid category\nUse category: other\nPlease contact <@72884988374167552>`);
			}
		});
	} else if (command == 'del' || command == 'delete') {
		if(trustedRole && message.member.roles.has(trustedRole.id) || overlordRole && message.member.roles.has(overlordRole.id) || message.author.id === config.ownerid) {
			db2.query(`DELETE FROM suggestions WHERE id = '${type}'`);
			message.channel.sendMessage(`Suggestion with ID: ${type} will be deleted`);
		} else {
			message.guild.channels.get(`${message.channel.id}`).sendMessage('You do not have permission to do that');
		}
	} else if (command == 'get' || command == 'list') {
		if(trustedRole && message.member.roles.has(trustedRole.id) || overlordRole && message.member.roles.has(overlordRole.id) || message.author.id === config.ownerid) {
			db2.query(`SELECT * FROM suggestions WHERE id = ${type} LIMIT 1`, function (err2, srows1, sfields) {
				if (srows1[0] != null) {
					let sid1 = srows1[0].id;
					let ntype1 = srows1[0].type;
					let ncontent1 = srows1[0].content;
					client.fetchUser(`${srows1[0].userid}`).then(function(result) {
						let nuser = result.username;
						message.guild.channels.get(`${config.adminchan}`).sendCode('asciidoc',`→::Suggestion::←\nID: ${sid1}\nUser: ${nuser}\nType: ${ntype1}\nContent: ${ncontent1}`);
					});
				} else {
					message.guild.channels.get(`${message.channel.id}`).sendMessage(`No suggestion with the ID: ${type} exists!`);
				}
			});
		} else {
			message.guild.channels.get(`${message.channel.id}`).sendMessage('You do not have permission to do that');
		}
	} else if (command == 'getall') {
		if(trustedRole && message.member.roles.has(trustedRole.id) || overlordRole && message.member.roles.has(overlordRole.id) || message.author.id === config.ownerid) {
			db2.query('SELECT * FROM suggestions ORDER BY id ASC LIMIT 5', function(err3, grows) {
				for(var i = 0; i < grows.length; i++) {
					(function(index) {
						setTimeout(function() {
							let sid1 = grows[index].id;
							let ntype1 = grows[index].type;
							let ncontent1 = grows[index].content;
							client.fetchUser(`${grows[index].userid}`).then(function(result) {
								let nuser = result.username;
								message.guild.channels.get(`${config.adminchan}`).sendCode('asciidoc',`→::Suggestion::←\nID: ${sid1}\nUser: ${nuser}\nType: ${ntype1}\nContent: ${ncontent1}`);
							});
						}, i * 1500);
					})(i);

				}
			});
		}
	} else if (command == 'categories') {
		var convertedArray = [];
		db2.query('SELECT cat_name FROM categories ORDER BY cat_name ASC', function(err4, crows) {
			for(var i = 0; i < crows.length; i++) {
				convertedArray.push(crows[i].cat_name);
			}
			let catString = convertedArray.join();
			message.guild.channels.get(`${message.channel.id}`).sendMessage(`Following categories exist: ${catString}`);
		});
	} else {
		message.guild.channels.get(`${message.channel.id}`).sendMessage(`Command ${command} does not exist!`);
	}

};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['suggestion'],
	permLevel: 2
};

exports.help = {
	name: 'suggest',
	description: 'Submits suggestions to a database to be looked at later',
	usage: 'suggest <del/delete> <id>, <get/list> <id>, <add> <category> <suggestion>'
};
