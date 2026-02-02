"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Converter = void 0;
exports.normalizeHex = normalizeHex;
exports.resolveColor = resolveColor;
function normalizeHex(hex) {
    if (hex.length === 4) {
        return ("#" +
            hex
                .slice(1)
                .split("")
                .map((c) => c + c)
                .join(""));
    }
    return hex.toLowerCase();
}
function resolveColor(color) {
    if (typeof color === "number") {
        return `#${color.toString(16).padStart(6, "0")}`;
    }
    if (color.startsWith("var(")) {
        const value = getComputedStyle(document.documentElement)
            .getPropertyValue(color.slice(4, -1))
            .trim();
        let [r, g, b] = value.split(",").map((v) => parseInt(v.trim(), 10));
        return rgbToHex(r, g, b);
    }
    if (color.includes(",")) {
        let [r, g, b] = color.split(",").map((v) => parseInt(v.trim(), 10));
        return rgbToHex(r, g, b);
    }
    if (color.startsWith("#")) {
        return normalizeHex(color);
    }
    throw new Error(`Unsupported color format: ${color}`);
}
exports.Converter = {
    hslToRgb,
    rgbToHsl,
    rgbToHex,
};
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h *= 60;
    }
    return { h, s, l };
}
function hslToRgb(h, s, l) {
    h /= 360;
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    }
    else {
        const hue2rgb = (p, q, t) => {
            if (t < 0)
                t += 1;
            if (t > 1)
                t -= 1;
            if (t < 1 / 6)
                return p + (q - p) * 6 * t;
            if (t < 1 / 2)
                return q;
            if (t < 2 / 3)
                return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
    };
}
function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}
