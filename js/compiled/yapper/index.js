"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yapper = void 0;
const markdown_1 = require("../util/markdown");
class Yapper {
    container;
    bubble;
    avatar;
    queue = [];
    isTalking = false;
    visible = false;
    wpm = 200;
    constructor() {
        this.container = document.createElement("div");
        this.container.classList.add("fixed", "bottom-6", "right-6", "z-[9999]", "flex", "items-end", "justify-end", "translate-y-[140%]", "transition-transform", "duration-300", "ease-out");
        this.avatar = document.createElement("img");
        this.avatar.src = "./images/yapper.jpg";
        this.avatar.classList.add("w-16", "h-16", "rounded-full", "shadow-lg", "shrink-0", "transition-transform", "duration-300", "ease-[cubic-bezier(.34,1.56,.64,1)]");
        this.bubble = document.createElement("div");
        this.bubble.classList.add("mr-3", "px-3", "py-2", "inline-block", "w-fit", "max-w-[280px]", "rounded-xl", "text-sm", "leading-relaxed", "bg-[#0e0f14]", "text-slate-200", "shadow-xl", "opacity-0", "translate-y-2", "transition-all", "duration-200", "pointer-events-none", "whitespace-pre-wrap", "break-words", "[overflow-wrap:anywhere]", "[&_code]:bg-black/40", "[&_code]:px-1", "[&_code]:rounded", "[&_code]:font-mono", "[&_a]:text-blue-400", "[&_a:hover]:underline");
        this.container.append(this.bubble, this.avatar);
        document.body.appendChild(this.container);
    }
    show() {
        this.visible = true;
        this.container.classList.remove("translate-y-[140%]");
        this.container.classList.add("translate-y-0");
        this.processQueue();
    }
    hide() {
        this.visible = false;
        this.container.classList.add("translate-y-[140%]");
        this.container.classList.remove("translate-y-0");
    }
    yap(msg, force = false) {
        if (force)
            this.queue.unshift(msg);
        else
            this.queue.push(msg);
        this.processQueue();
    }
    async processQueue() {
        if (this.isTalking || !this.visible)
            return;
        if (!this.queue.length)
            return;
        this.isTalking = true;
        this.startTalking();
        const msg = this.queue.shift();
        await this.typeMessage(msg);
        await this.sleep(this.getReadingTime(msg));
        this.stopBubble();
        await this.sleep(200);
        this.isTalking = false;
        if (!this.queue.length)
            this.stopTalking();
        this.processQueue();
    }
    startTalking() {
        this.avatar.classList.add("-translate-x-2");
        this.bubble.classList.remove("opacity-0", "translate-y-2");
        this.bubble.classList.add("opacity-100", "translate-y-0");
    }
    stopTalking() {
        this.avatar.classList.remove("-translate-x-2");
    }
    stopBubble() {
        this.bubble.classList.add("opacity-0", "translate-y-2");
        this.bubble.classList.remove("opacity-100", "translate-y-0");
    }
    async typeMessage(msg) {
        let current = "";
        for (let i = 0; i < msg.length; i++) {
            const char = msg[i];
            current += char;
            this.bubble.innerHTML = (0, markdown_1.parseMarkdown)(current);
            await this.sleep(this.getTypingDelay(char));
        }
    }
    getTypingDelay(char) {
        const mdSymbols = "*`[()_~";
        if (char === "]")
            return 140;
        if (mdSymbols.includes(char))
            return 2;
        if (".!?".includes(char))
            return 200 + Math.random() * 80;
        if (",:;".includes(char))
            return 120 + Math.random() * 60;
        return 10 + Math.random() * 18;
    }
    getReadingTime(text) {
        const words = text.trim().split(/\s+/).length;
        const factor = this.getWordScalingFactor(words);
        const effectiveWords = words * factor;
        return (effectiveWords / this.wpm) * 60000 + 600;
    }
    getWordScalingFactor(words) {
        if (words <= 16)
            return 1;
        if (words >= 60)
            return 0.5;
        const t = (words - 16) / (60 - 16);
        return 1 - t * 0.5;
    }
    sleep(ms) {
        return new Promise((r) => setTimeout(r, ms));
    }
}
exports.Yapper = Yapper;
__exportStar(require("./lines"), exports);
