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

export const RANDOM_YAPS: YapLine[] = [
  "what brand is your fridge? *blushes*",
  "*soft mascot noises*",
  "i am observing.",
  "the vibes shifted slightly",
  "did you scroll? i felt that.",
  "someone somewhere just committed to main",
  "you blinked. suspicious.",
  "this site runs on 3 lines of hope",
  "i could move. but i won't.",
  "debugging builds character",
  "i wonder if divs have feelings",
  "i sense productivity... faint, but present",
  "*stares at you respectfully*",
  "hydration reminder but make it passive aggressive",
  "i am 73% sure something is happening",
  "if this breaks it was intentional",
  "your mouse movements are chaotic",
  "*exists ominously*",
  () => {
    const now = new Date();
    const year =
      now.getMonth() === 11 && now.getDate() > 25
        ? now.getFullYear() + 1
        : now.getFullYear();

    const christmas = new Date(year, 11, 25);
    const days = Math.ceil((christmas.getTime() - now.getTime()) / 86400000);

    return days === 0
      ? "merry christmas 🎄"
      : `${days} days until christmas. behave.`;
  },
  () => {
    const now = new Date();
    const nextYear = new Date(now.getFullYear() + 1, 0, 1);
    const days = Math.ceil((nextYear.getTime() - now.getTime()) / 86400000);

    return `${days} days until new year. same you, new calendar.`;
  },
  () => {
    const hour = new Date().getHours();
    return hour >= 2 && hour <= 5
      ? "this is a villain origin hour"
      : "timeline stable";
  },
  () => {
    const now = new Date();
    const end = new Date(now.getFullYear(), 11, 31);
    const days = Math.ceil((end.getTime() - now.getTime()) / 86400000);

    return `${days} days left in ${now.getFullYear()}. no pressure.`;
  },
  () => {
    const seconds = Math.floor(performance.now() / 1000);
    return `you've been here for ${seconds}s. commitment.`;
  },
];

export const UNCOMMON_RANDOM_YAPS: YapLine[] = [
  "why are we both pretending this is normal",
  "this line was randomly selected. probably.",
  "somewhere there is a function deciding my fate",
  "you could delete me from the source code",
  "i am technically a side effect",
  "i don't have free will.",
  "yapper.yap('you found me')",
  "*remember what i say...*",
  "67",
  "i know where you are...",

  // lezi
  "lezi is bullshit fr",
  "lezi? self-mocking is crazy like wtf 🥀😭",
  "how dumb is the developer",
  "lezi thinks he's tuff",
  "lezi said 'trust me bro' and pushed to production",
  "lezi thinks he's tuff but forgot a semicolon",
  "self-mocking arc unlocked",
  "lezi definitely tested this once. maybe.",
  "confidence: high. documentation: low.",
  "**lezi vs common sense** — ongoing rivalry",
  "who let lezi cook",

  // source code
  "the developer was highh 🍃. src code shows.",
  "who approved this commit",
  "this code was held together by vibes and optimism",
  "the css is fighting for its life",
  "there is at least one unnecessary div here",
  "the developer said 'just one quick change'",
  "this feature was not in the original plan",
  "somewhere a linter is crying",
  'developer has "*if it works, do not touch it*" mentality',
  "the comments lie",
  "we *can* pretend src code is scalable",
  "this was tested emotionally, not technically",
  "the bugs are part of the design",
];

export async function resolveYap(line: YapLine): Promise<string> {
  return typeof line === "function" ? await line() : line;
}
