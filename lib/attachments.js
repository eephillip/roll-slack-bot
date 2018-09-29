"use strict";

const util = require('util');
const dmsays = require('./dmsays');
const debug = require('debug')('roll:attachments');

let trunc = function(text, max) {
    return text.substr(0, max - 1) + (text.length > max ? '...' : '');
};

exports.build = function(dice_result) {
    let response = [];

    debug(dice_result);

    if(dice_result && dice_result.length) {

        dice_result.forEach(res => {
            let a = {
                "mrkdwn_in": ["pretext", "text", "fields"],
                "text": "",
                "fields": [],
                "color": "good"
            };

            if (res.invalid) {
                a.color = 'danger';
                a.text =`*Invalid Roll:* ${res.invalid}`;
                a.fields[0] = {
                    value: `_${dmsays.rand()}_`,
                    short: false
                };

            } else {
                a.color = 'good';
                a.text =`*${res.input.toString()}*`;
                a.fields[0] = {
                    value: `\`${trunc(util.inspect(res.rolled, { breakLength: Infinity, manArrayDepth: null }), 60)} => ${res.result}\``,
                    short: false
                };
            }
            response.push(a);
        });

    } else {
        let a = {
            "mrkdwn_in": ["pretext", "text", "fields"],
            "text": "",
            "fields": [],
            "color": "good"
        };
        a.color = 'danger';
        a.text =`*Invalid Roll*`;
        a.fields[0] = {
            value: `_${dmsays.rand()}_`,
            short: false
        };
        response.push(a);
    }

    return JSON.stringify(response);
};


