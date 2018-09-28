"use strict";

let util = require('util');
let Botkit = require('botkit');
let debug = require('debug')('rolld');
let rr = require('./lib/diceroller');
let dmsays = require('./lib/dmsays');

let config = {};

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.PORT || !process.env.VERIFICATION_TOKEN) {
    console.log('Error: Specify CLIENT_ID, CLIENT_SECRET, VERIFICATION_TOKEN and PORT in environment');
    process.exit(1);
}

if (process.env.MONGOLAB_URI) {
    let BotkitStorage = require('botkit-storage-mongo');
    config = {
        storage: BotkitStorage({
            mongoUri: process.env.MONGOLAB_URI
        })
    };
} else {
    config = {
        json_file_store: './json_file_store/',
    };
}

let controller = Botkit.slackbot(config).configureSlackApp({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    scopes: ['commands'],
});

let trunc = function(text, max) {
    return text.substr(0, max - 1) + (text.length > max ? '...' : '');
};

let fmt = function(dice_result) {
    let msg = '';

    dice_result.forEach(res => {
        debug('%o', res);
        if (res.input) {
            msg += `*${res.input.toString()}*\n \`${trunc(util.inspect(res.rolled, { breakLength: Infinity, manArrayDepth: null }), 60)} => ${res.result}\` \n`;
        } else {
            msg += `*${res.invalid}*\n *Invalid Roll*: _${dmsays.rand()}_  \n`;
        }
    });

    return msg;
};

controller.setupWebserver(process.env.PORT, function(err, webserver) {
    controller.createWebhookEndpoints(controller.webserver);

    controller.createOauthEndpoints(controller.webserver, function(err, req, res) {
        if (err) {
            res.status(500).send('ERROR: ' + err);
        } else {
            res.send('Success!');
        }
    });
});


controller.on('slash_command', function(slashCommand, message) {

    switch (message.command) {
        case "/roll":

            if (message.token !== process.env.VERIFICATION_TOKEN) {
                return;
            }

            if (message.text === "" || message.text === "help") {
                slashCommand.replyPrivate(message,
                    'Please provide a dice roll command. e.g. `2d20b1+1d4+5` \n See https://github.com/troygoode/node-roll for more details');
                return;
            }

            slashCommand.replyPublic(message, fmt(rr.rollDice(message.text)));
            break;

        default:
            slashCommand.replyPublic(message, "I'm afraid I don't know how to " + message.command + " yet.");
    }

});
