"use strict";


exports.trunc = function(text, max) {
    return text.substr(0, max - 1) + (text.length > max ? '...' : '');
};




