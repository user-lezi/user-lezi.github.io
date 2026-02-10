import "./lont";
import { uwuifyPage, spinAccentHue, undoUwuifyPage } from "./actions";

export type EggAction = () => void | Promise<void>;

export interface EasterEgg {
  sequence: string[]; // Key sequence to trigger
  action: EggAction; // Function to run
  once?: boolean; // Trigger only once
  description?: string; // Optional console log
}

// Example eggs
export const easterEggs: EasterEgg[] = [
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
      "a",
    ],
    action: () => {
      console.log(
        "%cYou found the secret Konami!",
        "color: rgb(var(--accent-code)); font-size:16px",
      );
    },
    description: "Konami console log",
    once: true,
  },
  {
    sequence: ["u", "w", "u"],
    action: async () => {
      await uwuifyPage(25);
    },
    description: "UwUifies the entire page.",
    once: false,
  },
  {
    sequence: ["d", "e", "u", "w", "u"],
    action: async () => {
      await undoUwuifyPage(15);
    },
    description: "deUwUifies the entire page.",
    once: false,
  },
  {
    sequence: ["s", "p", "i", "n"],
    action: () => spinAccentHue(),
    description: "Spin accent hue 360",
    once: false,
  },
].sort((a, b) => b.sequence.length - a.sequence.length);

const keyBuffer: string[] = [];
const maxSequenceLength = Math.max(...easterEggs.map((e) => e.sequence.length));
let eggRunning = false;

window.addEventListener("keydown", (e) => {
  keyBuffer.push(e.key);
  if (keyBuffer.length > maxSequenceLength) keyBuffer.shift();
  for (const egg of easterEggs) {
    if (egg.sequence.length === 0) continue; // disabled

    if (!sequenceAtEnd(egg.sequence, keyBuffer)) continue;

    if (eggRunning) return; // lock

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

    if (egg.once) egg.sequence = []; // disable after first trigger
    break; // stop checking further eggs
  }
});

function sequenceAtEnd(seq: string[], buffer: string[]): boolean {
  if (seq.length > buffer.length) return false;
  // compare the last seq.length elements
  for (let i = 0; i < seq.length; i++) {
    if (buffer[buffer.length - seq.length + i] !== seq[i]) return false;
  }
  return true;
}
