"use strict";

let Roll = require('roll');
let rollme = new Roll();

exports.rollDice = function(dice_str) {

    // Sanitize dice roll string
    let clean = dice_str.toString('utf8').replace(/[^\n\x20-\x7E]/g, '').replace(/[^ 0-9db+\-*\/%]/g, '');
    let req = clean.split(' ').filter(el => el.length);
    let result = [];

    req.forEach(roll => {
        let isvalid = rollme.validate(roll);

        if (isvalid) {
            //Check for sane roll sizes
            let [cnt, side] = roll.split('d').map(el => parseInt(el, 10));
            // If user doesn't provide a dice count assume 1
            cnt = cnt === '' ? 1 : cnt;

            if(cnt > 1000 || side > 1000) {
                result.push({
                    invalid: `${roll} NICE TRY PAL!`
                });
            } else {
                result.push(rollme.roll(roll));
            }
        } else {
            result.push({
                invalid: roll
            });
        }
    });

    return result;
};