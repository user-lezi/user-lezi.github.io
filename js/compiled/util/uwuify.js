"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uwuifyText = uwuifyText;
function uwuifyText(text) {
    let out = text;
    out = out.replace(/[rl]/g, "w").replace(/[RL]/g, "W");
    out = out.replace(/\bn([aeiou])/gi, "ny$1");
    out = out.replace(/\b([a-z])/gi, (m, p1) => Math.random() < 0.1 ? `${p1}-${m}` : m);
    out = out.replace(/!+/g, () => {
        const faces = [" uwu!", " owo!", " >_<!", " 😳!"];
        return faces[Math.floor(Math.random() * faces.length)];
    });
    return out;
}
