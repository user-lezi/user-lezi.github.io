"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColoredTags = exports.AccentTags = exports.Projects = void 0;
exports.projectLoader = projectLoader;
const markdown_1 = require("./markdown");
exports.Projects = [
    {
        name: "ForgeIndia",
        order: 1,
        description: "Hinglish-powered ForgeScript extension.",
        github: "user-lezi/ForgeIndia",
        tags: ["forgescript", "typescript", "npm"],
        image: null,
        web: "https://docs.botforge.org/?p=ForgeIndia",
    },
    {
        name: "ForgeColor",
        order: 2,
        description: "A ForgeScript extension for generating gradients, color palettes, and blends — with built-in color theory, contrast, and accessibility tools.",
        github: "user-lezi/ForgeColor",
        tags: ["forgescript", "typescript", "npm"],
        image: null,
        web: "https://docs.botforge.org/?p=ForgeColor",
    },
    {
        name: "Test Bot BDFD",
        description: "**Test-Bot-BDFD** is a Discord bot made in **BDFD (bdscript)** — because apparently I was bored enough to code instead of sleeping.\nIt does stuff. You can use it if you want. 😎",
        github: "user-lezi/Test-Bot-BDFD",
        tags: ["bdfd", "bot"],
        image: "https://cdn.discordapp.com/avatars/941584115222859816/1f8bbdbe9168fde63769540e108a603f.png?size=1024",
        web: null,
    },
];
exports.AccentTags = [
    "forgescript",
    "typescript",
];
exports.ColoredTags = {
    experiment: 0xffff00,
};
function projectPriority(project) {
    if (project.tags.some((t) => exports.AccentTags.includes(t)))
        return 0;
    if (project.tags.some((t) => exports.ColoredTags[t]))
        return 1;
    return 2;
}
function sortProjects(projects) {
    return [...projects].sort((a, b) => {
        if (a.order !== undefined || b.order !== undefined) {
            return (a.order ?? 999) - (b.order ?? 999);
        }
        const pA = projectPriority(a);
        const pB = projectPriority(b);
        if (pA !== pB)
            return pA - pB;
        return a.name.localeCompare(b.name);
    });
}
function tagPriority(tag) {
    if (exports.AccentTags.includes(tag))
        return 0;
    if (exports.ColoredTags[tag])
        return 1;
    return 2;
}
function sortTags(tags) {
    return [...tags].sort((a, b) => {
        const pA = tagPriority(a);
        const pB = tagPriority(b);
        if (pA !== pB)
            return pA - pB;
        return a.localeCompare(b);
    });
}
async function projectLoader() {
    const grid = document.getElementById("projects-grid");
    const template = document.getElementById("project-template");
    if (!grid || !template)
        return;
    exports.Projects.forEach((project) => {
        const clone = template.content.cloneNode(true);
        const icon = clone.querySelector(".project-icon");
        const name = clone.querySelector(".project-name");
        const desc = clone.querySelector(".project-desc");
        const github = clone.querySelector(".project-github");
        const web = clone.querySelector(".project-web");
        const tags = clone.querySelector(".project-tags");
        if (!icon || !name || !desc || !github || !web || !tags)
            return;
        name.textContent = project.name;
        desc.innerHTML = (0, markdown_1.parseMarkdown)(project.description);
        github.href = `https://github.com/${project.github}`;
        if (project.web) {
            web.href = project.web;
            web.classList.remove("hidden");
        }
        const sortedTags = sortTags(project.tags);
        sortedTags.forEach((tag) => {
            const chip = document.createElement("span");
            chip.textContent = tag;
            chip.dataset.tag = tag;
            chip.className =
                "text-[0.65rem] px-2 py-[2px] rounded-md " +
                    "bg-white/8 text-slate-300 border border-white/10";
            const color = exports.ColoredTags[tag];
            if (color || exports.AccentTags.includes(tag)) {
                let resolved = resolveColor(color ?? "var(--accent-code)");
                chip.dataset.colored = "true";
                if (exports.AccentTags.includes(tag)) {
                    chip.dataset.accent = "true";
                }
                chip.style.background = `${resolved}22`;
                chip.style.color = resolved;
                chip.style.borderColor = `${resolved}55`;
            }
            tags.appendChild(chip);
        });
        if (project.image) {
            icon.style.backgroundImage = `url(${project.image})`;
            icon.style.backgroundSize = "cover";
            icon.style.backgroundPosition = "center";
        }
        else {
            icon.textContent = acronym(project.name);
            icon.style.background = `rgba(var(--accent-code), 0.15)`;
            icon.style.color = `rgb(var(--accent-code))`;
        }
        grid.appendChild(clone);
    });
}
function acronym(name) {
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 3)
        .toUpperCase();
}
function resolveColor(color) {
    if (typeof color === "number") {
        return `#${color.toString(16).padStart(6, "0")}`;
    }
    if (color.startsWith("var(")) {
        const value = getComputedStyle(document.documentElement)
            .getPropertyValue(color.slice(4, -1))
            .trim();
        return rgbToHex(value);
    }
    if (color.includes(",")) {
        return rgbToHex(color);
    }
    if (color.startsWith("#")) {
        return normalizeHex(color);
    }
    throw new Error(`Unsupported color format: ${color}`);
}
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
function rgbToHex(rgb) {
    const [r, g, b] = rgb.split(",").map((v) => parseInt(v.trim(), 10));
    return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}
