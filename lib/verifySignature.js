"use strict";

const crypto = require('crypto');
const debug = require('debug')('roll:verifySig');


const getAccessToken = (team_domain) => {
    let id = process.env.SLACK_TARGETS.split(',').indexOf(team_domain);
    if(id > -1) {
        return process.env.SLACK_ACCESS_TOKEN.split(',')[id];
    } else {
        return null;
    }
};

const getSigningSecret = (team_domain) => {
    let id = process.env.SLACK_TARGETS.split(',').indexOf(team_domain);
    if(id > -1) {
        return process.env.SLACK_SIGNING_SECRET.split(',')[id];
    } else {
        return null;
    }
};

const isVerified = (req) => {

    let team_domain = req.body.team_domain;

    let id = process.env.SLACK_TARGETS.split(',').indexOf(team_domain);
    if(id === -1) {
        debug(`Could not lookup team domain ${team_domain} ${id}`);
        return false;
    }

    const signature = req.headers['x-slack-signature'];
    const timestamp = req.headers['x-slack-request-timestamp'];
    const hmac = crypto.createHmac('sha256', getSigningSecret(team_domain));
    const [version, hash] = signature.split('=');

    // Check if the timestamp is too old
    const fiveMinutesAgo = ~~(Date.now() / 1000) - (60 * 5);
    if (timestamp < fiveMinutesAgo) {
        return false;
    }

    hmac.update(`${version}:${timestamp}:${req.rawBody}`);

    // check that the request signature matches expected value
    return hmac.digest('hex') === hash;
};

module.exports = { isVerified, getAccessToken, getSigningSecret };