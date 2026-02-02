"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // js/compiled/util/color.js
  var require_color = __commonJS({
    "js/compiled/util/color.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Converter = void 0;
      exports.normalizeHex = normalizeHex;
      exports.resolveColor = resolveColor;
      function normalizeHex(hex) {
        if (hex.length === 4) {
          return "#" + hex.slice(1).split("").map((c) => c + c).join("");
        }
        return hex.toLowerCase();
      }
      function resolveColor(color) {
        if (typeof color === "number") {
          return `#${color.toString(16).padStart(6, "0")}`;
        }
        if (color.startsWith("var(")) {
          const value = getComputedStyle(document.documentElement).getPropertyValue(color.slice(4, -1)).trim();
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
        rgbToHex
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
        } else {
          const hue2rgb = (p2, q2, t) => {
            if (t < 0)
              t += 1;
            if (t > 1)
              t -= 1;
            if (t < 1 / 6)
              return p2 + (q2 - p2) * 6 * t;
            if (t < 1 / 2)
              return q2;
            if (t < 2 / 3)
              return p2 + (q2 - p2) * (2 / 3 - t) * 6;
            return p2;
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
          b: Math.round(b * 255)
        };
      }
      function rgbToHex(r, g, b) {
        return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
      }
    }
  });

  // js/compiled/util/sleep.js
  var require_sleep = __commonJS({
    "js/compiled/util/sleep.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.sleep = sleep;
      function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
    }
  });

  // js/compiled/util/uwuify.js
  var require_uwuify = __commonJS({
    "js/compiled/util/uwuify.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.uwuifyText = uwuifyText;
      function uwuifyText(text) {
        let out = text;
        out = out.replace(/[rl]/g, "w").replace(/[RL]/g, "W");
        out = out.replace(/\bn([aeiou])/gi, "ny$1");
        out = out.replace(/\b([a-z])/gi, (m, p1) => Math.random() < 0.1 ? `${p1}-${m}` : m);
        out = out.replace(/!+/g, () => {
          const faces = [" uwu!", " owo!", " >_<!", " \u{1F633}!"];
          return faces[Math.floor(Math.random() * faces.length)];
        });
        return out;
      }
    }
  });

  // js/compiled/easter-eggs/actions.js
  var require_actions = __commonJS({
    "js/compiled/easter-eggs/actions.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.spinAccentHue = spinAccentHue;
      exports.uwuifyPage = uwuifyPage;
      exports.undoUwuifyPage = undoUwuifyPage;
      var color_1 = require_color();
      var sleep_1 = require_sleep();
      var uwuify_1 = require_uwuify();
      function spinAccentHue() {
        const root = document.documentElement;
        const current = getComputedStyle(root).getPropertyValue("--accent-code").trim();
        let [r, g, b] = current.split(",").map((x) => parseInt(x.trim()));
        let { h, s, l } = color_1.Converter.rgbToHsl(r, g, b);
        let step = 0;
        const totalSteps = 360;
        const intervalMs = 40;
        const interval = setInterval(() => {
          step++;
          h = (h + 1) % 360;
          const { r: nr, g: ng, b: nb } = color_1.Converter.hslToRgb(h, s, l);
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
          const uwu = (0, uwuify_1.uwuifyText)(original);
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
            await (0, sleep_1.sleep)(delay);
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
          await (0, sleep_1.sleep)(delay);
        }
      }
    }
  });

  // js/compiled/easter-eggs/index.js
  var require_easter_eggs = __commonJS({
    "js/compiled/easter-eggs/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.easterEggs = void 0;
      var actions_1 = require_actions();
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
            "a"
          ],
          action: () => {
            console.log("%cYou found the secret Konami!", "color: rgb(var(--accent-code)); font-size:16px");
          },
          description: "Konami console log",
          once: true
        },
        {
          sequence: ["u", "w", "u"],
          action: async () => {
            await (0, actions_1.uwuifyPage)(25);
          },
          description: "UwUifies the entire page.",
          once: false
        },
        {
          sequence: ["d", "e", "u", "w", "u"],
          action: async () => {
            await (0, actions_1.undoUwuifyPage)(15);
          },
          description: "deUwUifies the entire page.",
          once: false
        },
        {
          sequence: ["s", "p", "i", "n"],
          action: () => (0, actions_1.spinAccentHue)(),
          description: "Spin accent hue 360",
          once: false
        }
      ].sort((a, b) => b.sequence.length - a.sequence.length);
      var keyBuffer = [];
      var maxSequenceLength = Math.max(...exports.easterEggs.map((e) => e.sequence.length));
      var eggRunning = false;
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
            } else {
              eggRunning = false;
            }
          } catch (err) {
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
    }
  });

  // js/compiled/util/markdown.js
  var require_markdown = __commonJS({
    "js/compiled/util/markdown.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.parseMarkdown = parseMarkdown;
      exports.escapeHtml = escapeHtml;
      function parseMarkdown(input) {
        return escapeHtml(input).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>").replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>').replace(/\n/g, "<br>");
      }
      function escapeHtml(text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
      }
    }
  });

  // js/compiled/projects/projects.js
  var require_projects = __commonJS({
    "js/compiled/projects/projects.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Projects = void 0;
      exports.Projects = [
        {
          name: "ForgeIndia",
          order: 1,
          description: "Hinglish-powered ForgeScript extension.",
          github: "weebforge/ForgeIndia",
          tags: ["forgescript", "typescript", "npm"],
          image: null,
          web: null
        },
        {
          name: "ForgeColor",
          order: 2,
          description: "A ForgeScript extension for generating gradients, color palettes, and blends \u2014 with built-in color theory, contrast, and accessibility tools.",
          github: "user-lezi/ForgeColor",
          tags: ["forgescript", "typescript", "npm"],
          image: null,
          web: "https://docs.botforge.org/?p=ForgeColor"
        },
        {
          name: "Test Bot BDFD",
          description: "**Test-Bot-BDFD** is a Discord bot made in **BDFD (bdscript)** \u2014 because apparently I was bored enough to code instead of sleeping.\nIt does stuff. You can use it if you want. \u{1F60E}",
          github: "user-lezi/Test-Bot-BDFD",
          tags: ["bdfd", "bot"],
          image: "https://cdn.discordapp.com/avatars/941584115222859816/1f8bbdbe9168fde63769540e108a603f.png?size=1024",
          web: null
        }
      ];
    }
  });

  // js/compiled/projects/loader.js
  var require_loader = __commonJS({
    "js/compiled/projects/loader.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ColoredTags = exports.AccentTags = void 0;
      exports.projectLoader = projectLoader;
      var color_1 = require_color();
      var markdown_1 = require_markdown();
      var projects_1 = require_projects();
      exports.AccentTags = [
        "forgescript",
        "typescript"
      ];
      exports.ColoredTags = {
        experiment: 16776960,
        npm: 13318199
      };
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
        projects_1.Projects.forEach((project) => {
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
            chip.className = "text-[0.65rem] px-2 py-[2px] rounded-md bg-white/8 text-slate-300 border border-white/10";
            const color = exports.ColoredTags[tag];
            if (color || exports.AccentTags.includes(tag)) {
              let resolved = (0, color_1.resolveColor)(color ?? "var(--accent-code)");
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
          } else {
            icon.textContent = acronym(project.name);
            icon.style.background = `rgba(var(--accent-code), 0.15)`;
            icon.style.color = `rgb(var(--accent-code))`;
          }
          grid.appendChild(clone);
        });
      }
      function acronym(name) {
        return name.split(" ").map((w) => w[0]).join("").slice(0, 3).toUpperCase();
      }
    }
  });

  // js/compiled/index.js
  var require_index = __commonJS({
    "js/compiled/index.js"(exports) {
      Object.defineProperty(exports, "__esModule", { value: true });
      require_easter_eggs();
      var loader_1 = require_loader();
      if (document.querySelector("div#projects-grid"))
        (0, loader_1.projectLoader)();
    }
  });
  require_index();
})();
