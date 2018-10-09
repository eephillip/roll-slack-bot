"use strict";

const util = require('util');
const gpg = require('gpg');
const debug = require('debug')('roll:gpg');
const str = require('./strkit');
const TTable = require('text-table');
const dmsays = require('./dmsays');


exports.importEnvPrivateKey = function(done) {

    var key = process.env.GPG_PRIVATE_KEY.replace(/\\n/g, String.fromCharCode(10));

    gpg.call(key, ['--import'], function(err) {
        done(err);
    });
};

exports.format = function(dice_result) {

    let response = [];
    let tt = TTable;
    let tableOpt = {
        align: ['l']
    };

    response.push(['Command', 'Result', 'Calculation']);

    if(dice_result && dice_result.length) {
        dice_result.forEach(res => {
            if (res.invalid) {
                response.push(['Invalid Roll', res.invalid, dmsays.rand()]);
            } else {
                response.push([
                    res.input.toString(),
                    str.trunc(util.inspect(res.rolled, {
                        breakLength: Infinity,
                        manArrayDepth: null
                    }), 60),
                    res.result
                ]);
            }
        });
    } else {
        response.push(['Invalid Roll', dmsays.rand(), '']);
    }

    return tt(response, tableOpt);
};

exports.signText = function(text, done) {

    let args = [
      '--armor', '--clear-sign',
      '--batch','--yes',
      '--trust-model', 'always',
      '--pinentry-mode', 'loopback',
      '--passphrase', process.env.GPG_PASSPHRASE,
      '--default-key', process.env.GPG_KEYID,
    ];

    gpg.call(text, args, function(err, clearsigned) {
        done(err, clearsigned.toString('utf8'));
    });
};


