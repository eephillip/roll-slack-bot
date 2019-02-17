"use strict";

require('dotenv').config();

const path = require('path');
const util = require('util');

const debug = require('debug')('roll:index');
const _     = require('lodash');
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const qs = require('querystring');
const async = require('async');
const shortid = require('shortid');

const idioms = require('./idiom');
const DB = require('./db');
const gpg = require('./gpg-sign');
const rr = require('./diceroller');
const signature = require('./verifySignature');
const attachments = require('./attachments');

const apiUrl = 'https://slack.com/api';
const app = express();
const db = new DB();

const req_env = [
    'APP_URL',
    'NODE_ENV',
    'GPG_UID',
    'GPG_KEYID',
    'GPG_PASSPHRASE',
    'GPG_PRIVATE_KEY',
    'SLACK_TARGETS',
    'SLACK_ACCESS_TOKEN',
    'SLACK_SIGNING_SECRET'
];

const slack_multi_env = [
    'SLACK_TARGETS',
    'SLACK_ACCESS_TOKEN',
    'SLACK_SIGNING_SECRET'
];


app.disable('x-powered-by');
app.set('view engine', 'pug');
app.set('view options', { pretty: true });
app.set('views', path.join(__dirname, 'views'));

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

app.get('/result/:sid', (req, res) => {

    let sid = req.params.sid.replace(/[^\n\x20-\x7E]/g, '').replace(/[^A-Za-z,0-9_\-]/g, '');

    if( shortid.isValid(sid)) {
        db.collection.findOne({ sid }, (err, item) => {
            debug(err);

            if(err) {
                res.render('results', { title: 'Crunch Crunch', message: `Crunch Crunch ${err.message}` });

            } else if(item) {
                // res.render('results', { title: 'Hey', message: 'I found your results', results: util.inspect(item.res, { depth:null, breakLength: Infinity, manArrayDepth: null }) });
                res.render('results', {
                    title: 'RollBot',
                    message: `Hey, I found ${item.req.user_name}'s results`,
                    results: JSON.stringify(item.res, null, 4)
                });
            } else {
                res.render('results', { title: 'RollBot', message: 'Hmm, no results available', results: 'Womp Womp ...' });
            }
        });
    } else {
        debug('shortid not valid');
        res.render('results', { title: 'RollBot', message: 'That id is not valid', results: 'Womp Womp ...' });
    }

});

app.get('/', (req, res) => {
    res.send('<h2>The Slash Command and Dialog app is running</h2> <p>Follow the' +
        ' instructions in the README to configure the Slack App and your environment variables.</p>');
});

app.get('/404', (req, res) => {

    // Manual Setting of the http status code for correct _.ajax handling
    // without this the render send a 404 pages with status 200
    res.status(404);
    res.render('404', {
        title: '404 - Not Found',
        status: 404
    });
});


/*
 * Endpoint to receive /roll slash command from Slack.
 *
 */
app.post('/command', (req, res) => {
    // extract the slash command text, and channel ID from payload
    const { text, user_id, channel_id, user_name, team_domain } = req.body;

    debug(req.body);

    // Verify the signing secret
    if (signature.isVerified(req)) {

        //Empty response so it doesn't indicate timeout
        res.status(200).end();

        let response = {
            'message': {
                'token': signature.getAccessToken(team_domain),
                'channel': channel_id,
                'text': ''
            }
        }


        async.series([
            next => {

                if (text === "" || text === "help") {
                    response.message.text = 'Please provide a dice roll command. e.g. `2d20b1+1d4+5` \n See https://github.com/troygoode/node-roll for more details';
                    next(null);
                } else {

                    let req_clean = _.pick(req.body, [
                        'team_id',
                        'team_domain',
                        'channel_id',
                        'channel_name',
                        'user_id',
                        'user_name',
                        'command',
                        'text',
                        // 'response_url',
                        // 'trigger_id',
                    ]);


                    if(text.includes('sign')) {
                        response.dice_results = rr.rollDice(text.replace(/sign/g, '').trim());

                        gpg.signText(gpg.format(response.dice_results), (err, signed_result) => {
                            if(err) {
                                console.log(err);
                            } else {
                                response.message.text = `*${process.env.GPG_UID} ${process.env.GPG_KEYID}*\n\`\`\`${signed_result}\`\`\``;
                            }
                            let sid = shortid.generate();
                            db.insert({ req: req_clean, res: response.dice_results, sid }, err  => {
                                next(err);
                            });
                        });

                    } else {
                        response.dice_results = rr.rollDice(text);
                        let sid = shortid.generate();
                        response.message.attachments = attachments.build(response.dice_results, `${process.env.APP_URL}/result/${sid}`);
                        db.insert({ req: req_clean, res: response.dice_results, sid }, err => {
                            next(err);
                        });
                    }
                }
            }
        ], err => {
            if(err) {
                debug(err);
                return;
            }

            if (_.some(response.dice_results, 'invalid')) {
                // Post the response using attachments
                response.message.user = user_id;
                axios.post(`${apiUrl}/chat.postEphemeral`, qs.stringify(response.message))
                    .then((result) => {
                        debug('chat.postMessage: %o', result.data);
                    }).catch((err) => {
                        debug('chat.postMessage call failed: %o', err);
                    });
            } else {
                axios.post(`${apiUrl}/chat.postMessage`, qs.stringify(response.message))
                    .then((result) => {
                        debug('chat.postMessage: %o', result.data);
                    }).catch((err) => {
                        debug('chat.postMessage call failed: %o', err);
                    });
            }

        });


    } else {
        debug('Verification token mismatch');
        res.sendStatus(404);
    }
});

app.get('*', (req, res) => {
    res.redirect('/404');
});

// ------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------

async.series([
    next => {
        gpg.importEnvPrivateKey(err => {
            next(err);
        });
    },
    next => {
        db.connect(err => {
             if(err) {
                next(err);
                return;
             }

             db.printStat(err => {
                next(err);
            });
        });
    },
    () => {
        const server = app.listen(process.env.PORT || 5000, () => {
            console.log('Express server listening %s', process.env.APP_URL);
            console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
        });
    }

], err => {
    if(err) {
        console.log(err.message);
        process.exit(1);
    }

});
