"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMarkdown = parseMarkdown;
exports.escapeHtml = escapeHtml;
function parseMarkdown(input) {
    const codeBlocks = [];
    let text = escapeHtml(input)
        .replace(/`([^`]+?)`/g, (_, code) => {
        const token = `%%CODE_${codeBlocks.length}%%`;
        codeBlocks.push(`<code>${code}</code>`);
        return token;
    })
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/(^|[^*])\*(.+?)\*(?!\*)/g, "$1<em>$2</em>")
        .replace(/~~(.+?)~~/g, "<s>$1</s>")
        .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
        .replace(/\n/g, "<br>");
    codeBlocks.forEach((block, i) => {
        text = text.replace(`%%CODE_${i}%%`, block);
    });
    return text;
}
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
