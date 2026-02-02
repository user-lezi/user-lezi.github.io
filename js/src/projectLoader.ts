import { parseMarkdown } from "./markdown";

export const Projects: IProject[] = [
  {
    name: "ForgeIndia",
    order: 1,
    description: "Hinglish-powered ForgeScript extension.",
    github: "weebforge/ForgeIndia",
    tags: ["forgescript", "typescript", "npm"],
    image: null,
    web: null,
  },
  {
    name: "ForgeColor",
    order: 2,
    description:
      "A ForgeScript extension for generating gradients, color palettes, and blends — with built-in color theory, contrast, and accessibility tools.",
    github: "user-lezi/ForgeColor",
    tags: ["forgescript", "typescript", "npm"],
    image: null,
    web: "https://docs.botforge.org/?p=ForgeColor",
  },
  {
    name: "Test Bot BDFD",
    description:
      "**Test-Bot-BDFD** is a Discord bot made in **BDFD (bdscript)** — because apparently I was bored enough to code instead of sleeping.\nIt does stuff. You can use it if you want. 😎",
    github: "user-lezi/Test-Bot-BDFD",
    tags: ["bdfd", "bot"],
    image:
      "https://cdn.discordapp.com/avatars/941584115222859816/1f8bbdbe9168fde63769540e108a603f.png?size=1024",
    web: null,
  },
];

export interface IProject {
  name: string;
  order?: number;
  description: string;
  github: string;
  tags: ProjectTag[];
  image: string | null;
  web: string | null;
}
export type ProjectTag =
  | "forgescript"
  | "discordjs"
  | "bdfd"
  | "discord"
  | "typescript"
  | "javascript"
  | "bot"
  | "npm"
  | "web"
  | "experiment";
export const AccentTags = [
  "forgescript",
  "typescript",
] as const satisfies readonly ProjectTag[];
export const ColoredTags: Partial<Record<ProjectTag, number | string>> = {
  experiment: 0xffff00,
  npm: 0xcb3837,
};

function projectPriority(project: IProject): number {
  if (project.tags.some((t) => AccentTags.includes(t as any))) return 0;
  if (project.tags.some((t) => ColoredTags[t])) return 1;
  return 2;
}
function sortProjects(projects: IProject[]): IProject[] {
  return [...projects].sort((a, b) => {
    if (a.order !== undefined || b.order !== undefined) {
      return (a.order ?? 999) - (b.order ?? 999);
    }

    const pA = projectPriority(a);
    const pB = projectPriority(b);

    if (pA !== pB) return pA - pB;
    return a.name.localeCompare(b.name);
  });
}

function tagPriority(tag: ProjectTag): number {
  if (AccentTags.includes(tag as any)) return 0;
  if (ColoredTags[tag]) return 1;
  return 2;
}
function sortTags(tags: ProjectTag[]): ProjectTag[] {
  return [...tags].sort((a, b) => {
    const pA = tagPriority(a);
    const pB = tagPriority(b);

    if (pA !== pB) return pA - pB;
    return a.localeCompare(b);
  });
}

export async function projectLoader() {
  const grid = document.getElementById("projects-grid");
  const template = document.getElementById(
    "project-template",
  ) as HTMLTemplateElement | null;

  if (!grid || !template) return;

  Projects.forEach((project) => {
    const clone = template.content.cloneNode(true) as DocumentFragment;

    const icon = clone.querySelector<HTMLDivElement>(".project-icon");
    const name = clone.querySelector<HTMLHeadingElement>(".project-name");
    const desc = clone.querySelector<HTMLParagraphElement>(".project-desc");
    const github = clone.querySelector<HTMLAnchorElement>(".project-github");
    const web = clone.querySelector<HTMLAnchorElement>(".project-web");
    const tags = clone.querySelector<HTMLDivElement>(".project-tags");

    if (!icon || !name || !desc || !github || !web || !tags) return;

    // Text
    name.textContent = project.name;
    desc.innerHTML = parseMarkdown(project.description);

    // GitHub
    github.href = `https://github.com/${project.github}`;

    // Website
    if (project.web) {
      web.href = project.web;
      web.classList.remove("hidden");
    }

    // Tags
    const sortedTags = sortTags(project.tags);

    sortedTags.forEach((tag) => {
      const chip = document.createElement("span");
      chip.textContent = tag;

      chip.dataset.tag = tag;

      chip.className =
        "text-[0.65rem] px-2 py-[2px] rounded-md " +
        "bg-white/8 text-slate-300 border border-white/10";

      const color = ColoredTags[tag];

      if (color || AccentTags.includes(tag as any)) {
        let resolved = resolveColor(color ?? "var(--accent-code)");

        chip.dataset.colored = "true";

        if (AccentTags.includes(tag as any)) {
          chip.dataset.accent = "true";
        }

        chip.style.background = `${resolved}22`;
        chip.style.color = resolved;
        chip.style.borderColor = `${resolved}55`;
      }

      tags.appendChild(chip);
    });

    // Icon
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
function acronym(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}
function resolveColor(color: number | string): string {
  // 1. Integer hex (0xffaa00)
  if (typeof color === "number") {
    return `#${color.toString(16).padStart(6, "0")}`;
  }

  // 2. CSS variable: var(--accent-code) → "r, g, b"
  if (color.startsWith("var(")) {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(color.slice(4, -1))
      .trim();
    return rgbToHex(value);
  }

  // 3. RGB string: "255, 170, 0"
  if (color.includes(",")) {
    return rgbToHex(color);
  }

  // 4. Hex string (#fff or #ffffff)
  if (color.startsWith("#")) {
    return normalizeHex(color);
  }

  throw new Error(`Unsupported color format: ${color}`);
}

function normalizeHex(hex: string): string {
  if (hex.length === 4) {
    return (
      "#" +
      hex
        .slice(1)
        .split("")
        .map((c) => c + c)
        .join("")
    );
  }

  return hex.toLowerCase();
}

function rgbToHex(rgb: string): string {
  const [r, g, b] = rgb.split(",").map((v) => parseInt(v.trim(), 10));

  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}
