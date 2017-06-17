/* server.js */
'use strict';
const express = require('express');
const app = express();
const port = process.env.PORT || 4205;
const router = express.Router();

process.env.token = 'xoxb-197296342337-NcAr4XFcb529ZUagnfMNXPER';

//var chatbots = require("./chatbots.js");
//chatbots.fn.slackBot();
if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('./node_modules/botkit/lib/Botkit.js');
var os = require('os');

var controller = Botkit.slackbot({
    debug: false,
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();


// controller.hears(['hello', 'hi', 'wassup'], 'direct_message,direct_mention,mention', function(bot, message) {

//     bot.api.reactions.add({
//         timestamp: message.ts,
//         channel: message.channel,
//         name: 'robot_face',
//     }, function(err, res) {
//         if (err) {
//             bot.botkit.log('Failed to add emoji reaction :(', err);
//         }
//     });

//  bot.reply(message, 'Hello ' + message.user);
//     // controller.storage.users.get(message.user, function(err, user) {
//     //     if (user && user.name) {
//     //         bot.reply(message, 'Hello ' + user.name + '!!');
//     //     } else {
//     //         bot.reply(message, 'Hello.');
//     //     }
//     // });
// });

controller.hears(['.*'], ['direct_message', 'direct_mention'], (bot, message) => {
			controller.log('Slack message received');
			bot.reply(message, 'I have received your message!');
		});