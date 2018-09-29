"use strict";

require('dotenv').config();

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
    const {text, channel_id, user_name } = req.body;

    debug(req.body);
    // Verify the signing secret
    if (signature.isVerified(req)) {

        const dice_results = {
            token: process.env.SLACK_ACCESS_TOKEN,
            channel: channel_id,
            text: `${user_name}'s Dice Roll Results`,
        };

        if (text === "" || text === "help") {
            dice_results.text = 'Please provide a dice roll command. e.g. `2d20b1+1d4+5` \n See https://github.com/troygoode/node-roll for more details';
        } else {
            dice_results.attachments = attachments.build(rr.rollDice(text));
        }

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


