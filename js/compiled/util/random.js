"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickRandom = pickRandom;
function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
