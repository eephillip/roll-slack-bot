"use strict";

require('dotenv').config();
const util = require('util');
const debug = require('debug')('roll:index');
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const qs = require('querystring');
const app = express();

const rr = require('./diceroller');
const signature = require('./verifySignature');
const attachments = require('./attachments');

const apiUrl = 'https://slack.com/api';

const req_env = ['NODE_ENV', 'SLACK_TARGETS', 'SLACK_ACCESS_TOKEN', 'SLACK_SIGNING_SECRET'];
const slack_multi_env = ['SLACK_TARGETS', 'SLACK_ACCESS_TOKEN', 'SLACK_SIGNING_SECRET'];

// Env Pre check
if( ! req_env.every(key => process.env.hasOwnProperty(key) && process.env[key].length > 0)) {
    console.log(`Error: Specify ${req_env.join(", ")} in environment`);
    process.exit(1);
}

// Env check multi slack entries comma delimited
const slack_cnt = process.env.SLACK_TARGETS.split(',').length;
if( ! slack_multi_env.every(key => process.env[key].split(',').length === slack_cnt )) {
    console.log(`Error: Multi Slack Env Detected make sure each ${slack_multi_env.join(", ")} entry has ${slack_cnt} entries`);
    process.exit(1);
}

/*
 * Parse application/x-www-form-urlencoded && application/json
 * Use body-parser's `verify` callback to export a parsed raw body
 * that you need to use to verify the signature
 */
const rawBodyBuffer = (req, res, buf, encoding) => {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
};

app.use(bodyParser.urlencoded({
    verify: rawBodyBuffer,
    extended: true
}));

app.use(bodyParser.json({
    verify: rawBodyBuffer
}));

app.get('/', (req, res) => {
    res.send('<h2>The Slash Command and Dialog app is running</h2> <p>Follow the' +
        ' instructions in the README to configure the Slack App and your environment variables.</p>');
});

/*
 * Endpoint to receive /roll slash command from Slack.
 *
 */
app.post('/command', (req, res) => {
    // extract the slash command text, and channel ID from payload
    const {text, channel_id, user_name, team_domain } = req.body;

    debug(req.body);
    // Verify the signing secret
    if (signature.isVerified(req)) {

        const dice_results = {
            token: signature.getAccessToken(team_domain),
            channel: channel_id,
            text: `${user_name}'s Dice Roll Results`,
        };

        if (text === "" || text === "help") {
            dice_results.text = 'Please provide a dice roll command. e.g. `2d20b1+1d4+5` \n See https://github.com/troygoode/node-roll for more details';
        } else {
            dice_results.attachments = attachments.build(rr.rollDice(text));
        }

        debug(util.inspect(dice_results, { depth:null, breakLength: Infinity, manArrayDepth: null }));


        // Post the response using attachments
        axios.post(`${apiUrl}/chat.postMessage`, qs.stringify(dice_results))
            .then((result) => {
                debug('chat.postMessage: %o', result.data);
                res.send('');
            }).catch((err) => {
                debug('chat.postMessage call failed: %o', err);
                res.sendStatus(500);
            });

    } else {
        debug('Verification token mismatch');
        res.sendStatus(404);
    }
});


const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});


