"use strict";

let expect = require('chai').expect;
let rr = require('../lib/ability');

describe('Character Ability Score Rolling', () => {

    xit('Function does not blow up', () => {
        expect(() => rr.rollAbility('asdfasdfasd')).to.not.throw();
        expect(rr.rollAbility('asdfasdfasdf')[0]).to.be.an('object').that.has.all.keys('invalid');
    });

    it('Run the default 5e ability score method', () => {
        expect(rr.rollAbility('')).to.be.an('object')
    });

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
    // /roll ability 4d6b3+5x7 l10u20 order
    // ```









});