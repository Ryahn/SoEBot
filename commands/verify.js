const mysql = require('mysql');
const config = require('../auth.json');
const db = mysql.createConnection({
	host: config.mysqlhost,
	user: config.mysqluser,
	password: config.mysqlpass,
	database: config.mysqldb
});
db.connect();
exports.run = function(client, message, params) {
	if (!message.guild) {
		return;
	}
	let player = message.guild.roles.get('291308126999674880');
	let overseer = message.guild.roles.get('297560438986506241');
	let channel = message.guild.channels.find('name','newcomers').toString();
  // let member = message.guild.member(message.author.username);
	let member = message.author.id;
	let email = params[0];
	if(message.channel == message.guild.channels.find('name','newcomers'))
  {
		db.query(`SELECT * FROM data WHERE email = '${email}' LIMIT 1`, function (err, rows, fields)
    {
			if(rows[0] != null)
      {
				db.query(`SELECT * FROM verified WHERE email = '${rows[0].email}'`, function (err, vrows, vfields)
        {
					if(vrows[0] != null)
          {
						message.channel.sendMessage('You have either pledged in the past or someone else used your email. Please contact an admin');
					} else if(rows[0].ammount >=1000 && rows[0].ammount <10000)
          {
              // member.addRole(player).catch(console.log);
              // message.channel.sendMessage(member + " " + email);
						console.log(member + ' ' + email);
						db.query(`INSERT INTO verified (userid, email) VALUES ('${member}', '${email}')`);
					} else if(rows[0].ammount >=10000)
            {
                  // member.addRole(overseer).catch(console.log);
					}
				});
			} else if (rows[0] == null )
      {
				message.reply('Please be sure your email is correct');
			}
		});
		if(!params[0]) {
			message.delete().then(msg => console.log('Deleted message from ' + msg.author.username)).catch(console.error);
			message.channel.sendMessage('You must supply an email');
		}
	} else {
		message.delete().then(msg => console.log('Deleted message from ' + msg.author.username)).catch(console.error);
		message.channel.sendMessage('You must use this command in ' + channel);
	}
};
db.close;

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['v'],
	permLevel: 0
};

exports.help = {
	name: 'verify',
	description: 'Used by all new members. This is for self role assigning. Be sure to use your patreon email!',
	usage: 'verify <email>'
};
