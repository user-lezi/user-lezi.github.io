"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spinAccentHue = spinAccentHue;
exports.uwuifyPage = uwuifyPage;
exports.undoUwuifyPage = undoUwuifyPage;
exports.uwuifyText = uwuifyText;
const color_1 = require("./color");
function spinAccentHue() {
    const root = document.documentElement;
    const current = getComputedStyle(root)
        .getPropertyValue("--accent-code")
        .trim();
    let [r, g, b] = current.split(",").map((x) => parseInt(x.trim()));
    let { h, s, l } = (0, color_1.rgbToHsl)(r, g, b);
    let step = 0;
    const totalSteps = 360;
    const intervalMs = 40;
    const interval = setInterval(() => {
        step++;
        h = (h + 1) % 360;
        const { r: nr, g: ng, b: nb } = (0, color_1.hslToRgb)(h, s, l);
        root.style.setProperty("--accent-code", `${nr}, ${ng}, ${nb}`);
        if (step >= totalSteps) {
            clearInterval(interval);
            root.style.setProperty("--accent-code", current);
        }
    }, intervalMs);
}
async function uwuifyPage(delay = 20) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.textContent?.trim())
            nodes.push(node);
    }
    let i = 0;
    for (const node of nodes) {
        const original = node.textContent;
        const uwu = uwuifyText(original);
        if (uwu !== original) {
            const span = document.createElement("span");
            span.textContent = uwu;
            span.dataset.uwu = "true";
            span.dataset.original = original;
            span.style.background = "rgba(var(--accent-code), 0.15)";
            span.style.transition = "background 1s ease";
            node.replaceWith(span);
            setTimeout(() => {
                span.style.background = "transparent";
            }, 500 + delay * i);
            i++;
            await sleep(delay);
        }
    }
}
async function undoUwuifyPage(delay = 10) {
    const uwuNodes = Array.from(document.querySelectorAll("span[data-uwu='true']"));
    for (const span of uwuNodes) {
        const original = span.dataset.original;
        if (!original)
            continue;
        const textNode = document.createTextNode(original);
        span.style.background = "rgba(var(--accent-code), 0.2)";
        span.style.transition = "background 0.4s ease";
        span.replaceWith(textNode);
        await sleep(delay);
    }
}
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
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
