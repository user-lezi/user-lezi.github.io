export const Projects: IProject[] = [
  {
    name: "WeebForge",
    order: 1,
    description:
      "Small Team of Developers providing an extensive library for ForgeScript.",
    github: "weebforge",
    org: true,
    tags: ["forgescript", "typescript", "npm", "discord"],
    image: "https://avatars.githubusercontent.com/u/232826805?s=1000v=4",
    web: null,
  },
  {
    name: "Test Bot BDFD",
    description:
      "**Test-Bot-BDFD** is a Discord bot made in **BDFD (bdscript)** — because apparently I was bored enough to code instead of sleeping.\nIt does stuff. You can use it if you want. 😎",
    github: "user-lezi/Test-Bot-BDFD",
    org: false,
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
  org: boolean; // is a github org?
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
