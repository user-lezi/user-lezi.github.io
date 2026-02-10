"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.easterEggs = void 0;
require("./lont");
const actions_1 = require("./actions");
exports.easterEggs = [
    {
        sequence: [
            "ArrowUp",
            "ArrowUp",
            "ArrowDown",
            "ArrowDown",
            "ArrowLeft",
            "ArrowRight",
            "ArrowLeft",
            "ArrowRight",
            "b",
            "a",
        ],
        action: () => {
            console.log("%cYou found the secret Konami!", "color: rgb(var(--accent-code)); font-size:16px");
        },
        description: "Konami console log",
        once: true,
    },
    {
        sequence: ["u", "w", "u"],
        action: async () => {
            await (0, actions_1.uwuifyPage)(25);
        },
        description: "UwUifies the entire page.",
        once: false,
    },
    {
        sequence: ["d", "e", "u", "w", "u"],
        action: async () => {
            await (0, actions_1.undoUwuifyPage)(15);
        },
        description: "deUwUifies the entire page.",
        once: false,
    },
    {
        sequence: ["s", "p", "i", "n"],
        action: () => (0, actions_1.spinAccentHue)(),
        description: "Spin accent hue 360",
        once: false,
    },
].sort((a, b) => b.sequence.length - a.sequence.length);
const keyBuffer = [];
const maxSequenceLength = Math.max(...exports.easterEggs.map((e) => e.sequence.length));
let eggRunning = false;
window.addEventListener("keydown", (e) => {
    keyBuffer.push(e.key);
    if (keyBuffer.length > maxSequenceLength)
        keyBuffer.shift();
    for (const egg of exports.easterEggs) {
        if (egg.sequence.length === 0)
            continue;
        if (!sequenceAtEnd(egg.sequence, keyBuffer))
            continue;
        if (eggRunning)
            return;
        eggRunning = true;
        try {
            const result = egg.action();
            if (result instanceof Promise) {
                result.finally(() => {
                    eggRunning = false;
                });
            }
            else {
                eggRunning = false;
            }
        }
        catch (err) {
            console.error("Easter egg failed:", err);
            eggRunning = false;
        }
        if (egg.once)
            egg.sequence = [];
        break;
    }
});
function sequenceAtEnd(seq, buffer) {
    if (seq.length > buffer.length)
        return false;
    for (let i = 0; i < seq.length; i++) {
        if (buffer[buffer.length - seq.length + i] !== seq[i])
            return false;
    }
    return true;
}
