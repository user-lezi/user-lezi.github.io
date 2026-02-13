import { pickRandom } from "../util/random";

export type YapLine = string | (() => string | Promise<string>);
export const STARTUP_YAPS: YapLine[] = [
  "oh nice, another curious soul",
  "this site contains at least one questionable decision",

  () => `current vibe check: ${Math.floor(Math.random() * 100)}%`,

  "**please DO NOT feed the mascot after midnight**",

  // time based
  () => {
    const hour = new Date().getHours();

    if (hour < 5) return "sleep is optional i guess";
    if (hour < 12) return "gm internet person";
    if (hour < 18) return "afternoon productivity arc?";
    return "evening scrolling detected";
  },

  // weekday aware
  () => {
    const day = new Date().getDay();

    const days = [
      "sunday = existential dread preview",
      "monday moment",
      "tuesday is just monday 2",
      "midweek survival checkpoint",
      "thursday pretending to be productive",
      "friday detected 👀",
      "weekend energy unlocked",
    ];

    return days[day];
  },

  // user performance style guess
  () => {
    const types = [
      "lurker",
      "developer",
      "speedrunner",
      "bug hunter",
      "chaos tester",
    ];
    return `you look like a *${pickRandom(types)}*`;
  },

  // fake analytics jokes
  () => {
    const rand = () => Math.floor(Math.random() * 40) + 60;

    return pickRandom([
      `${rand()}% chance you clicked this accidentally`,
      `${rand()}% of users pretend they understand this site`,
      `${rand()}% confidence you are procrastinating`,
      `${rand()}% chance you said "just one minute"`,
      `${rand()}% of stats are made up anyway`,
      `${rand()}% chance you forgot why you opened this`,
    ]);
  },

  // screen size awareness
  () => {
    const width = window.innerWidth;

    if (width < 500) return "tiny screen gang";
    if (width < 1000) return "respectable viewport";
    return "ultrawide overlord detected";
  },

  // timezone vibe
  () => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return `broadcasting from ${tz}`;
  },

  // battery API (safe fallback)
  async () => {
    if (!("getBattery" in navigator)) return "battery unknown, vibes full";

    const battery = await (navigator as any).getBattery();
    return `battery morale: ${Math.round(battery.level * 100)}%`;
  },
];

export async function resolveYap(line: YapLine): Promise<string> {
  return typeof line === "function" ? await line() : line;
}
