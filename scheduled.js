var Discord = require("discord.js");
var fs = require('fs');
var ini = require('ini');
var bot = new Discord.Client();

if(fs.existsSync("./config.ini") === false) {
	console.log("ERROR : config.ini file doesn't exist or unreadable.");
	process.exit(1);
}

var config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
if(config.token == undefined) {
	console.log("ERROR : You must to specify the \"token\" parameter in config.ini file.");
	process.exit(1);
}

var token = config.token;
var lang = "en";
var translate = null;

if(config.lang != undefined) {
	lang = config.lang;
}
else {
	console.log("WARNING : \"lang\" parameter is not specified in your config.ini file, so the default language is set to \"en\"");
}

if(fs.existsSync("./translate/" + config.lang + '.json') === false) {
	console.log("ERROR : ./translate/" + config.lang + ".json file doesn't exist or unreadable.");
	process.exit(1);
}
else {
	try {
		translate = JSON.parse(fs.readFileSync("./translate/" + config.lang + '.json', 'utf-8'));
	}
	catch(e) {
		console.log("ERROR : JSON parse error in ./translate/" + config.lang + ".json file : " + e);
		process.exit(1);
	}
}

var scheduledMessages = new Array();

var help = translate.message_help;

bot.on("ready", () => {
	console.log("INFO : Bot started");
	fs.readFile('./messages.json', 'utf8', function(err, data){
    	if(err) {
			console.log("ERROR : Error on reading file messages.json : " + err);
		}
		else {
			try {
				var t = JSON.parse(data);
				var newList = new Array();
				for(var i = 0; i < t.length; i++) {
					t[i].date = new Date(t[i].date);
					var today = new Date();
					if(t[i].date.getTime() > today.getTime()) {
						newList.push(t[i]);
					}
				}
				scheduledMessages = newList;
				var txt = JSON.stringify(scheduledMessages);
				fs.writeFile("./messages.json", txt, function (err) {
					if (err) {
						console.log("ERROR : Error on writing file messages.json : " + err);
					}
				});
				console.log("INFO : Scheduled messages imported from messages.json");
			}
			catch(e) {
				scheduledMessages = new Array();
			}
		}
	});
});

setInterval(function() {
	var removeItem = -1;
	for(var i = 0; i < scheduledMessages.length; i++) {
		var d = new Date();
		if(scheduledMessages[i].date.toString() === d.toString()) {
			try {
				var channelID = scheduledMessages[i].channel.substring(2).slice(0, -1);
				bot.guilds.cache.get(scheduledMessages[i].server).channels.cache.get(channelID).send(scheduledMessages[i].message);
				removeItem = i;
			}
			catch(e) {

			}
		}
	}
	if(removeItem != -1) {
		scheduledMessages.splice(removeItem, 1);
		var txt = JSON.stringify(scheduledMessages);
		fs.writeFile("./messages.json", txt, function (err) {
			if (err) {
				console.log("ERROR : Error on writing file messages.json : " + err);
			}
		});
	}
}, 350);

bot.on("message", (message) => {
	if(message.content.startsWith("*schedule ") === true || message.content == "*schedule")
	{
		var command = message.content.split(" ");
		
		if(message.member.roles.highest.permissions.has("ADMINISTRATOR") === true || message.member.roles.highest.permissions.has("MANAGE_CHANNELS") === true) {
			if(command.length >= 5) {
				var d = new Date(command[1] + " " + command[2]);
				if(d != "Invalid Date") {
					var today = new Date();

					if(today.getTime() < d.getTime()) {
						if(command[3].startsWith("<#")) {
							try {
								var idMessage = Math.random().toString(36).substring(3);

								var resp = translate.confirm_schedule;
								resp = resp.replace("{idMessage}" , idMessage);
								resp = resp.replace("{channel}" , command[3]);
								resp = resp.replace("{date}" , command[1]);
								resp = resp.replace("{time}" , command[2]);

								message.reply(resp);

								var n = message.content.replace(command[0] + " " + command[1] + " " + command[2] + " " + command[3] + " ",'');
								var m = {id:idMessage, date:d, message:n, channel:command[3], instance:message, author:message.author.username, server:message.guild.id};
								scheduledMessages.push(m);
								var txt = JSON.stringify(scheduledMessages);
								fs.writeFile("./messages.json", txt, function (err) {
									if (err) {
										console.log("ERROR : Error on writing file messages.json : " + err);
									}
								});
							}
							catch(e) {
	
							}
						}
						else {
							try {
								message.reply(translate.error_channel + help);
							}
							catch(e) {

							}
						}
					}
					else {
						try {
							message.reply(translate.date_time_later + help);
						}
						catch(e) {

						}
					}
				}
				else {
					try{
						message.reply(translate.date_time_invalid + help);
					}
					catch(e) {

					}
				}
			}
			else {
				try {
					message.reply(help);
				}
				catch(e) {

				}
			}
		}
	}

	if(message.content.startsWith("*schedulelist") === true)
	{
		if(message.member.roles.highest.permissions.has("ADMINISTRATOR") === true || message.member.roles.highest.permissions.has("MANAGE_CHANNELS") === true) {
			var resp = translate.list_message;

			for(var i = 0; i < scheduledMessages.length; i++) {
				if(scheduledMessages[i].server == message.guild.id) {
					function pad(number) {
						if ( number < 10 ) {
						return '0' + number;
						}
						return number;
					}

					var stringFullDate = scheduledMessages[i].date.getFullYear() + "-" + pad(scheduledMessages[i].date.getMonth() + 1) + "-" + pad(scheduledMessages[i].date.getDate()) + " " + pad(scheduledMessages[i].date.getHours()) + ":" + pad(scheduledMessages[i].date.getMinutes()) + ":" + pad(scheduledMessages[i].date.getSeconds());

					resp += "- ID: **" + scheduledMessages[i].id + "** " + translate.from_message + " *" + scheduledMessages[i].author + "*, " + translate.in_message + " " + scheduledMessages[i].channel + " (" + stringFullDate + ") :\n" + scheduledMessages[i].message.slice(0, 50) + "...\n\n";
				}
			}

			try {
				message.reply(resp);
			}
			catch(e) {

			}
		}
	}

	if(message.content.startsWith("*scheduledelete") === true)
	{
		if(message.member.roles.highest.permissions.has("ADMINISTRATOR") === true || message.member.roles.highest.permissions.has("MANAGE_CHANNELS") === true) {
			var command = message.content.split(" ");
			if(command.length == 2) {
				var found = false;
				for(var i = 0; i < scheduledMessages.length; i++) {
					if(command[1] == scheduledMessages[i].id) {
						found = i;
					}
				}
				if(found === false) {
					try {
						message.reply(translate.message_not_found);
					}
					catch(e) {

					}
				}
				else {
					if(scheduledMessages[found].server == message.guild.id) {
						scheduledMessages.splice(found, 1);
						var txt = JSON.stringify(scheduledMessages);
						fs.writeFile("./messages.json", txt, function (err) {
							if (err) {
									console.log("ERROR : Error on writing file messages.json : " + err);
							}
						});
						try {
							var rr = translate.confirm_delete;
							rr = rr.replace("{idMessage}" , command[1]);
							message.reply(rr);
						}
						catch(e) {

						}
					}
					else {
						try {
							message.reply(translate.message_not_found);
						}
						catch(e) {

						}
					}
				}
			}
			else {
				try {
					message.reply(translate.help_delete);
				}
				catch(e) {

				}
			}
		}
	}

});

bot.login(token);