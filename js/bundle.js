"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

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

  // js/compiled/util/random.js
  var require_random = __commonJS({
    "js/compiled/util/random.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.pickRandom = pickRandom;
      function pickRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
      }
    }
  });

  // js/compiled/yapper/lines.js
  var require_lines = __commonJS({
    "js/compiled/yapper/lines.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.STARTUP_YAPS = void 0;
      exports.resolveYap = resolveYap;
      var random_1 = require_random();
      exports.STARTUP_YAPS = [
        "oh nice, another curious soul",
        "this site contains at least one questionable decision",
        () => `current vibe check: ${Math.floor(Math.random() * 100)}%`,
        "**please DO NOT feed the mascot after midnight**",
        () => {
          const hour = (/* @__PURE__ */ new Date()).getHours();
          if (hour < 5)
            return "sleep is optional i guess";
          if (hour < 12)
            return "gm internet person";
          if (hour < 18)
            return "afternoon productivity arc?";
          return "evening scrolling detected";
        },
        () => {
          const day = (/* @__PURE__ */ new Date()).getDay();
          const days = [
            "sunday = existential dread preview",
            "monday moment",
            "tuesday is just monday 2",
            "midweek survival checkpoint",
            "thursday pretending to be productive",
            "friday detected \u{1F440}",
            "weekend energy unlocked"
          ];
          return days[day];
        },
        () => {
          const types = [
            "lurker",
            "developer",
            "speedrunner",
            "bug hunter",
            "chaos tester"
          ];
          return `you look like a *${(0, random_1.pickRandom)(types)}*`;
        },
        () => {
          const rand = () => Math.floor(Math.random() * 40) + 60;
          return (0, random_1.pickRandom)([
            `${rand()}% chance you clicked this accidentally`,
            `${rand()}% of users pretend they understand this site`,
            `${rand()}% confidence you are procrastinating`,
            `${rand()}% chance you said "just one minute"`,
            `${rand()}% of stats are made up anyway`,
            `${rand()}% chance you forgot why you opened this`
          ]);
        },
        () => {
          const width = window.innerWidth;
          if (width < 500)
            return "tiny screen gang";
          if (width < 1e3)
            return "respectable viewport";
          return "ultrawide overlord detected";
        },
        () => {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          return `broadcasting from ${tz}`;
        },
        async () => {
          if (!("getBattery" in navigator))
            return "battery unknown, vibes full";
          const battery = await navigator.getBattery();
          return `battery morale: ${Math.round(battery.level * 100)}%`;
        }
      ];
      async function resolveYap(line) {
        return typeof line === "function" ? await line() : line;
      }
    }
  });

  // js/compiled/yapper/index.js
  var require_yapper = __commonJS({
    "js/compiled/yapper/index.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      }) : (function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        o[k2] = m[k];
      }));
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.yapper = exports.Yapper = void 0;
      var markdown_1 = require_markdown();
      var Yapper = class {
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
          return effectiveWords / this.wpm * 6e4 + 600;
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
      };
      exports.Yapper = Yapper;
      exports.yapper = new Yapper();
      __exportStar(require_lines(), exports);
    }
  });

  // js/compiled/easter-eggs/lont.js
  var require_lont = __commonJS({
    "js/compiled/easter-eggs/lont.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var yapper_1 = require_yapper();
      var lontCount = 0;
      document.querySelectorAll("[lont]").forEach((el) => {
        el.addEventListener("click", () => {
          lontCount++;
          if (lontCount === 4)
            yapper_1.yapper.yap("One more?", true);
          if (lontCount === 5) {
            changeFont();
            yapper_1.yapper.yap("**let me cook \u{1F525}\u{1F525}**", true);
          }
        });
      });
      function changeFont() {
        const style = document.createElement("style");
        style.textContent = `@font-face { font-family: "Lont"; src: url("./fonts/Lont-Regular.ttf") format("truetype"); } body { font-family: "Lont", san-serif; }`;
        document.head.appendChild(style);
      }
    }
  });

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
      var yapper_1 = require_yapper();
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
        yapper_1.yapper.yap(`*UwU :3*`, true);
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
      require_lont();
      var actions_1 = require_actions();
      var yapper_1 = require_yapper();
      var sleep_1 = require_sleep();
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
          sequence: ["d", "e", "b", "u", "g"],
          action: async () => {
            let debug = localStorage.getItem("debugMode");
            if (debug && debug == "true") {
              localStorage.setItem("debugMode", "false");
              yapper_1.yapper.yap("that will be a great choice.");
            } else {
              localStorage.setItem("debugMode", "true");
              yapper_1.yapper.yap(`No way you want to debug...`);
            }
            await (0, sleep_1.sleep)(1e3);
          }
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

  // js/compiled/projects/projects.js
  var require_projects = __commonJS({
    "js/compiled/projects/projects.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Projects = void 0;
      exports.Projects = [
        {
          name: "WeebForge",
          order: 1,
          description: "Small Team of Developers providing an extensive library for ForgeScript.",
          github: "weebforge",
          org: true,
          tags: ["forgescript", "typescript", "npm", "discord"],
          image: "https://avatars.githubusercontent.com/u/232826805?s=1000v=4",
          web: null
        },
        {
          name: "Test Bot BDFD",
          description: "**Test-Bot-BDFD** is a Discord bot made in **BDFD (bdscript)** \u2014 because apparently I was bored enough to code instead of sleeping.\nIt does stuff. You can use it if you want. \u{1F60E}",
          github: "user-lezi/Test-Bot-BDFD",
          org: false,
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
      var random_1 = require_random();
      var yapper_1 = require_yapper();
      if (document.querySelector("div#projects-grid"))
        (0, loader_1.projectLoader)();
      document.querySelector("[summon-yapper]").addEventListener("click", async () => {
        if (yapper_1.yapper.visible)
          return;
        yapper_1.yapper.show();
        const line = await (0, yapper_1.resolveYap)((0, random_1.pickRandom)(yapper_1.STARTUP_YAPS));
        yapper_1.yapper.yap(line, true);
      });
      window.yapper = yapper_1.yapper;
    }
  });
  require_index();
})();
