import { resolveColor } from "../util/color";
import { parseMarkdown } from "../util/markdown";
import { ProjectTag, IProject, Projects } from "./projects";

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
    github.href = `https://github.com/${project.org}`;

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
