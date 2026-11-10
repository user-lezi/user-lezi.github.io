export interface Contact {
  name: string;
  handle: string;
  link: string;
  icon: string;
  subtitle?: string;
}

export const CONTACTS: Contact[] = [
  {
    name: "Discord",
    handle: "@butwhylezi",
    link: "https://discord.com/users/910837428862984213",
    icon: "fa-brands fa-discord",
  },
  {
    name: "GitHub",
    handle: "@user-lezi",
    link: "https://github.com/user-lezi",
    icon: "fa-brands fa-github",
  },
];

