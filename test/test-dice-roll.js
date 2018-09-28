"use strict";

let expect = require('chai').expect;
let rr = require('../lib/diceroller');

describe('Dice Roll Requests', () => {
    it('Compound dice rolls', () => {
        expect(rr.rollDice('2d20+1d20')).to.be.an('array');
    });

    it('Multi single die rolls', () => {
        expect(rr.rollDice('10d20')[0].rolled).to.be.an('array');
        expect(rr.rollDice('2d20')[0].result).to.be.within(2, 40);
        expect(rr.rollDice('3d20')[0].result).to.be.within(3, 60);
        expect(rr.rollDice('4d20')[0].result).to.be.within(4, 80);
        expect(rr.rollDice('5d20')[0].result).to.be.within(5, 100);
        expect(rr.rollDice('6d20')[0].result).to.be.within(6, 120);
        expect(rr.rollDice('7d20')[0].result).to.be.within(7, 140);
    });

    it('Function does not blow up', () => {
        expect(() => rr.rollDice('asdfasdfasd')).to.not.throw();
        expect(rr.rollDice('asdfasdfasdf')[0]).to.be.an('object').that.has.all.keys('invalid');
    });

    it('Simple single die rolls', () => {
        expect(rr.rollDice('1d1')[0].result).to.be.within(1, 1);
        expect(rr.rollDice('1d2')[0].result).to.be.within(1, 2);
        expect(rr.rollDice('1d3')[0].result).to.be.within(1, 3);
        expect(rr.rollDice('1d4')[0].result).to.be.within(1, 4);
        expect(rr.rollDice('1d5')[0].result).to.be.within(1, 5);
        expect(rr.rollDice('1d6')[0].result).to.be.within(1, 6);
        expect(rr.rollDice('1d7')[0].result).to.be.within(1, 7);
        expect(rr.rollDice('1d8')[0].result).to.be.within(1, 8);
        expect(rr.rollDice('1d9')[0].result).to.be.within(1, 9);
        expect(rr.rollDice('1d10')[0].result).to.be.within(1, 10);
        expect(rr.rollDice('1d11')[0].result).to.be.within(1, 11);
        expect(rr.rollDice('1d12')[0].result).to.be.within(1, 12);
        expect(rr.rollDice('1d13')[0].result).to.be.within(1, 13);
        expect(rr.rollDice('1d14')[0].result).to.be.within(1, 14);
        expect(rr.rollDice('1d15')[0].result).to.be.within(1, 15);
        expect(rr.rollDice('1d16')[0].result).to.be.within(1, 16);
        expect(rr.rollDice('1d17')[0].result).to.be.within(1, 17);
        expect(rr.rollDice('1d18')[0].result).to.be.within(1, 18);
        expect(rr.rollDice('1d19')[0].result).to.be.within(1, 19);
        expect(rr.rollDice('1d20')[0].result).to.be.within(1, 20);
        expect(rr.rollDice('1d100')[0].result).to.be.within(1, 100);
        expect(rr.rollDice('1d1000')[0].result).to.be.within(1, 1000);
    });
});