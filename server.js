/* server.js */
'use strict';
const express = require('express');
const app = express();
const port = process.env.PORT || 8888;
const router = express.Router();

process.env.token = '';
process.env.token ='';

if (!process.env.token) {
    console.log('Error: Specify token in environment');
    //process.exit(1);
}

var Botkit = require('./node_modules/botkit/lib/Botkit.js');
var os = require('os');

var controller = Botkit.slackbot({
    debug: false,
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();

var servicenow = require('servicenow');
                var config = {
                    instance: "https://carsdev.service-now.com",
                    username: "svc_commandcenter",
                    password: "175@Jackson"
                };

var client = new servicenow.Client(config);

var CarsCABArray = [];
//CarsCABArray.push('skhan');

GetCarsCabUserNames();

controller.hears(['.*'], 'ambient,mention,direct_mention', (bot, message) => {
            controller.log('Slack message received');
            bot.api.users.info({user: message.user}, function(err, info){
            
           // console.log('message :'+ message.text);
            var msg =message.text;
            // for(var i=0; i<message.match.length; i++)
            //     msg += message.match[i];

            console.log(msg);
            console.log(message.user);

            //var regex = /(seeking[\s\S]+)?(approve|approval|apprve[\s$]*)[\s\S]*(chg[0-9]{7,})(.|.*)/gi;
            var regex = /(approve|approval|apprve|apprv)[\s\S]+(chg[0-9]{7,})|((chg[0-9]{7,})[\s\S]+(approve|approval|apprve|apprv)[\s$]+)/gi;
            var regex2 = /((chg[0-9]{7,})[\s]+approved)[\s.]*$|(approved[\s]+(chg[0-9]{7,}))[\s.]*$/gi;
            
            var str = msg;
            var m;
            var chgangeRequest='';
            while ((m = regex.exec(str)) !== null) {
                
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                
                chgangeRequest = m[2] || m[4];
                break;
            }

            var n;
            var chgangeRequest2='';
            while ((n = regex2.exec(str)) !== null) {
                
                if (n.index === regex2.lastIndex) {
                    regex2.lastIndex++;
                }
                
                chgangeRequest2 =n[2] || n[4];
                break;
            }

            if(chgangeRequest2.length>0)
            {
                if(!IsCarsCab(info.user.name, CarsCABArray))
                {
                    bot.reply(message, "Only CarsCAB members are authorized to approve a change request.");
                }
                else
                {
                    var o = {
                            "u_cab_decision": "Approved",
                            "approval" : "approved"
                        };
                    
                    client.update("change_request","number="+chgangeRequest2,o,function(error,result) {
                    if(!error) {
                        // result contains array of full updated objects
                        if(result.records.length>0)
                        {
                           console.log(JSON.stringify(result.records[0]));
                           bot.reply(message, chgangeRequest2 +" has been approved successfully.");
                        }
                        else
                        {
                             bot.reply(message, chgangeRequest2 +": "+ "invalid number.");
                        }
                    }
                });
                }
            }
            else if(chgangeRequest.length>0)
            {
                  client.getRecords("change_request","number="+chgangeRequest,function(error,result) {
                  if(!error) 
                  {
                    var reply = "";
                    if(result.records.length>0)
                    {
                        reply = chgangeRequest +": "+result.records[0].short_description+"; Start Date/Time :"
                        +result.records[0].start_date;
                        bot.reply(message, reply);
                    }
                    else
                    {
                        bot.reply(message, chgangeRequest +": "+ "invalid number.");
                    }
                  }
                  else
                    console.log(error);
                });
            }
            });
        });

//info.user.name

controller.hears(['.*'], 'direct_message', (bot, message) => {
            controller.log('Slack message received');
            bot.reply(message, 'Please use direct message instead.');
        });


app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});

function IsCarsCab(username, UserNames)
{
   return UserNames.indexOf(username)>=0;
}

function GetCarsCabUserNames()
{
    var grp =[];
    client.getRecords("sys_user_group","name=CarsCAB",function(error,result) {
                  if(!error) 
                  {
                    if(result.records.length>0)
                    {
                        var sysId = result.records[0].sys_id;

                            client.getRecords("sys_user_grmember","group="+sysId,function(error,result) {
                                if(!error) 
                                {
                                    for(var k=0; k<result.records.length; k++)
                                    {
                                        var userSysId = result.records[k].user;

                                        client.getRecords("sys_user","sys_id="+userSysId,function(error,result) {
                                            if(!error & result.records.length>0) 
                                            {
                                                var u = result.records[0].user_name;
                                                CarsCABArray.push(u);
                                                console.log(u);
                                            }
                                        });
                                    }

                                    //return grp;
                                }
                            });
                    }
                  }
                });

    //return grp;
}