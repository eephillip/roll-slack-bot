"use strict";
// Curated selection from https://www.dailywritingtips.com/45-idioms-with-roll/

let idioms = [
    'a rolling stone gathers no moss',
    'get rolling',
    'get the ball rolling',
    'start the ball rolling',
    'heads will roll',
    'let it roll',
    'let the good times roll',
    'let’s rock and roll',
    'on a roll',
    'ready to roll',
    'roll along',
    'roll around',
    'roll back',
    'roll back the clock',
    'roll back the years',
    'roll by',
    'roll call',
    'roll in',
    'roll in the hay',
    'roll off the tongue',
    'roll out',
    'roll out the red carpet',
    'roll out the welcome mat',
    'roll over',
    'roll over and play dead',
    'roll over in one’s grave',
    'roll the bones',
    'roll the dice',
    'roll up your sleeves',
    'roll up in',
    'roll up the sidewalks',
    'roll with it',
    'roll with the punches',
    'rolled into one',
    'rolling in dough',
    'rolling in it',
    'rolling in money',
    'rolling in the aisles',
    'rolling on the floor',
    'rolling on the floor laughing',
    'rolling stone',
];
exports.rand = function() {
    return idioms[Math.floor(Math.random() * idioms.length)];
};