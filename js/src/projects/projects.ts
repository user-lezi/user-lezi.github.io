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
