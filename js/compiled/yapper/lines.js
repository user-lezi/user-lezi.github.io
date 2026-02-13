"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STARTUP_YAPS = void 0;
exports.resolveYap = resolveYap;
const random_1 = require("../util/random");
exports.STARTUP_YAPS = [
    "oh nice, another curious soul",
    "this site contains at least one questionable decision",
    () => `current vibe check: ${Math.floor(Math.random() * 100)}%`,
    "**please DO NOT feed the mascot after midnight**",
    () => {
        const hour = new Date().getHours();
        if (hour < 5)
            return "sleep is optional i guess";
        if (hour < 12)
            return "gm internet person";
        if (hour < 18)
            return "afternoon productivity arc?";
        return "evening scrolling detected";
    },
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
    () => {
        const types = [
            "lurker",
            "developer",
            "speedrunner",
            "bug hunter",
            "chaos tester",
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
            `${rand()}% chance you forgot why you opened this`,
        ]);
    },
    () => {
        const width = window.innerWidth;
        if (width < 500)
            return "tiny screen gang";
        if (width < 1000)
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
    },
];
async function resolveYap(line) {
    return typeof line === "function" ? await line() : line;
}
