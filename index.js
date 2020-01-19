var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

var exec = require('child_process').exec;

function execute(command, callback) {
    exec(command, function (error, stdout, stderr) {
        callback(stdout);
    });
};

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch (cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
                break;
            case 'meme':
                bot.sendMessage({
                    to: channelID,
                    message: 'Generating meme... Visit this link to see a bunch of other memes: https://twitter.com/InstaMeme7'
                });
                var final_text;
                execute("node ./InstaMeme/index.js", (output) => {
                    console.log(output);
                    final_text = output;
                });
                setTimeout(() => {
                    console.log('sending message: ' + final_text);
                    bot.sendMessage({
                        to: channelID,
                        message: final_text
                    });
                }, 5000)
                break;
                // Just add any case commands if you want to..
        }
    }
});