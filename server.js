/* server.js */
'use strict';
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const router = express.Router();

process.env.token = '';

//var chatbots = require("./chatbots.js");
//chatbots.fn.slackBot();
if (!process.env.token) {
    console.log('Error: Specify token in environment');
    //process.exit(1);
}

app.get('/setToken', function(request, response) {
    process.env.token = request.query.token;

var Botkit = require('./node_modules/botkit/lib/Botkit.js');
var os = require('os');

var controller = Botkit.slackbot({
    debug: false,
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();

controller.hears(['.*'], 'direct_message', (bot, message) => {
            controller.log('Slack message received');
            bot.api.users.info({user: message.user}, function(err, info){
                
            var msg = message.match[0];

            var j=5; var i=1;
           
            Test(bot,i,j,message);
            
            });    
        });

controller.hears(['.*'], 'mention,direct_mention', (bot, message) => {
            controller.log('Slack message received');
            bot.reply(message, 'Please use direct message instead.');
        });

    response.end("I have received the ID: " + process.env.token);
});



app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});

// /(?:^|\s)^chg[0-9]{7,}/gi - chg12345678 regex

function Test(bot,i,j,message)
{
    bot.reply(message, 'I have received your message '+ info.user.name + ' '+i);

    if(++i<j)
    {
        setTimeout(function(){
             
                   Test(i, j);
            }, 1000);               
    }
}