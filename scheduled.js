var Discord = require("discord.js");
var fs = require('fs');
var bot = new Discord.Client();

var token = "...PUT YOUR BOT TOKEN HERE...";

var scheduledMessages = new Array();

var help = "Help :\n``*schedule [date] [time] [channel] [message]``\n\nSchedule a delayed sending of a message.\nThe date and time must be in the following format ``YYYY-MM-DD HH:mm:SS``";

bot.on("ready", () => {
	console.log("Bot started");
	fs.readFile('./messages.json', 'utf8', function(err, data){
    	if(err) {
			console.log("Error on reading file messages.json : " + err);
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
						console.log("Error on writing file messages.json : " + err);
					}
				});
				console.log("Scheduled messages imported from messages.json");
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
				console.log("Error on writing file messages.json : " + err);
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
								message.reply("Your message (ID : **" + idMessage + "**) has been scheduled to be published in the channel " + command[3] + " on " + command[1] + " at " + command[2] + " !");
								var n = message.content.replace(command[0] + " " + command[1] + " " + command[2] + " " + command[3] + " ",'');
								var m = {id:idMessage, date:d, message:n, channel:command[3], instance:message, author:message.author.username, server:message.guild.id};
								scheduledMessages.push(m);
								var txt = JSON.stringify(scheduledMessages);
								fs.writeFile("./messages.json", txt, function (err) {
									if (err) {
										console.log("Error on writing file messages.json : " + err);
									}
								});
							}
							catch(e) {
	
							}
						}
						else {
							try {
								message.reply("You must specify a channel \n\n" + help);
							}
							catch(e) {

							}
						}
					}
					else {
						try {
							message.reply("The date/time must be later than the current date/time\n\n" + help);
						}
						catch(e) {

						}
					}
				}
				else {
					try{
						message.reply("Invalid date / time format\n\n" + help);
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
			var reponse = "List of scheduled messages :\n\n";

			for(var i = 0; i < scheduledMessages.length; i++) {
				if(scheduledMessages[i].server == message.guild.id) {
					function pad(number) {
						if ( number < 10 ) {
						return '0' + number;
						}
						return number;
					}

					var stringFullDate = scheduledMessages[i].date.getFullYear() + "-" + pad(scheduledMessages[i].date.getMonth() + 1) + "-" + pad(scheduledMessages[i].date.getDate()) + " " + pad(scheduledMessages[i].date.getHours()) + ":" + pad(scheduledMessages[i].date.getMinutes()) + ":" + pad(scheduledMessages[i].date.getSeconds());

					reponse += "- ID: **" + scheduledMessages[i].id + "** from *" + scheduledMessages[i].author + "*, in " + scheduledMessages[i].channel + " (" + stringFullDate + ") :\n" + scheduledMessages[i].message.slice(0, 50) + "...\n\n";
				}
			}

			try {
				message.reply(reponse);
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
						message.reply("This message could not be found. List of messages : ``*schedulelist``");
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
									console.log("Error on writing file messages.json : " + err);
							}
						});
						try {
							message.reply("The message with ID **" + command[1] + "**  has been removed from the list :ok_hand:");
						}
						catch(e) {

						}
					}
					else {
						try {
							message.reply("This message could not be found. List of messages : ``*schedulelist``");
						}
						catch(e) {

						}
					}
				}
			}
			else {
				try {
					message.reply("Help :\n``*scheduledelete [id]``\n\nDelete an existing message by its id. List of messages : ``*schedulelist``");
				}
				catch(e) {

				}
			}
		}
	}

});

bot.login(token);