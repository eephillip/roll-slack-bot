"use strict";

let util = require('util');
let _ = require('lodash');
let Roll = require('roll');
let debug = require('debug')('roll:ability');
let rollit = new Roll();

exports.roll = function(dice_str) {



    // D&D Character ability score rolling.
    // You have 6 Ability scores to roll for.
    // *Str*ength, *Dex*terity, *Con*stitution, *Int*ellect, *Wis*dom, and *Cha*risma.
    // Methods
    // - Standard Set `15,14,13,12,10,8`
    // - Point buy
    // - Dice Roll


    // Default
    // - 4d6 drop 1 by 6
    // - 3d6 by 6
    // - 5d6 drop 2 by 6
    // - 4d6 drop 1 by replace low 18
    // - 2d6+4 by 6
    // - 3d6 by 12 best six.
    // - 3d6 by 6 by 6.


    // Proposed vocabulary
    // ```
    // /roll <type> <dice> <limits> <ordered> <replacelow>
    // ```


    // Sanitize dice roll string
    let abilities =['Str', 'Dex', 'Con', 'Int', 'Wis', 'Cha'];



    // /roll ability 4d6b3+5x7 l10u20 order
    let clean = dice_str.toString('utf8').replace(/[^\n\x20-\x7E]/g, '').replace(/[^ 0-9db+\-*\/%]/g, '');
    let req = clean.split(' ').filter(el => el.length);
    let res = {drop:[], rolls:[]};


    if( req.length == 0 ) {
        // Roll the default method
        let repeat = 7
        let drop = 1
        for( let i=0; i < repeat; i+=1) {
            res.rolls.push(rollit.roll('4d6b3'));
        }

        debug(res.rolls.map(x => x.result));

        for( let i=0; i<drop; i+=1) {
            let min = Math.min.apply(null, res.rolls.map(x => x.result))

            res.rolls.splice(res.rolls.findIndex(el => el.result == min), 1);
            res.drop.push(min);
            debug(`Dropping ${min}`);
        }

        res.scores = res.rolls.map(x => x.result);
        res.sorted = [...res.rolls.map(x => x.result)].sort((a,b) => b - a);

        // res.applied = Object.assign(abilities.map((k, i) => ({[k]: res.scores[i]})))
        res.ordered = abilities.reduce((o, k, i) => ({...o, [k]: res.scores[i]}), {})


    }
    debug(util.inspect(res, {depth:null}))

    // "text": "Ability Roll *4d6b3 x 7* Drop Lowest",
    return JSON.stringify([{
            "mrkdwn_in": ["pretext", "text", "fields"],
            "text": "",
            "fields": [{
                "value": _.map(res.ordered, (v, k) => `${k}: *${v}*`).join(' '),
                "short": false
            }, {
                "value": `Rolls: *${res.scores.join(' ')}* _~${res.drop.join(' ')}~_`,
                "short": false
            }, {
                "value": `Sorted: *${res.sorted.join(' ')}*`,
                "short": false
            }],
            "color": "good",
            // "title_link": "",
            "title": ""
        }]);

};