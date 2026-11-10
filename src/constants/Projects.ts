export interface Project {
  title: string;
  category: string;
  description: string;
  buttonText: string;
  link: string;
  previewImage: string;
}

export const PROJECTS: Project[] = [
  {
    title: "Chai",
    category: "website",
    description:
      "A web riddle where your browser's address bar is the puzzle. It all started over a single cup of tea.",
    buttonText: "Visit",
    previewImage: "https://chai-i.netlify.app/assets/og-image.png",
    link: "https://chai-i.netlify.app",
  },
  {
    title: "Leziscript",
    category: "library",
    description:
      "An Esolang that can be interpreted or transpiled to JavaScript code.",
    buttonText: "View Code",
    previewImage: "/assets/i/lzs-banner.png",
    link: "https://github.com/user-lezi/leziscript-esolang",
  },
];
