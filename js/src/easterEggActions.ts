import { rgbToHsl, hslToRgb } from "./color";

export function spinAccentHue() {
  const root = document.documentElement;

  // Parse the current RGB value from CSS variable
  const current = getComputedStyle(root)
    .getPropertyValue("--accent-code")
    .trim();

  let [r, g, b] = current.split(",").map((x) => parseInt(x.trim()));

  let { h, s, l } = rgbToHsl(r, g, b);

  let step = 0;
  const totalSteps = 360;
  const intervalMs = 40;

  const interval = setInterval(() => {
    step++;
    h = (h + 1) % 360; // rotate hue slowly
    const { r: nr, g: ng, b: nb } = hslToRgb(h, s, l);

    root.style.setProperty("--accent-code", `${nr}, ${ng}, ${nb}`);

    if (step >= totalSteps) {
      clearInterval(interval);
      root.style.setProperty("--accent-code", current); // restore original
    }
  }, intervalMs);
}

export async function uwuifyPage(delay = 20) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

  const nodes: Text[] = [];
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    if (node.textContent?.trim()) nodes.push(node);
  }
  let i = 0;
  for (const node of nodes) {
    const original = node.textContent!;
    const uwu = uwuifyText(original);

    if (uwu !== original) {
      const span = document.createElement("span");
      span.textContent = uwu;
      span.dataset.uwu = "true";
      span.dataset.original = original;
      span.style.background = "rgba(var(--accent-code), 0.15)";
      span.style.transition = "background 1s ease";

      node.replaceWith(span);

      // fade highlight
      setTimeout(
        () => {
          span.style.background = "transparent";
        },
        500 + delay * i,
      );
      i++;

      await sleep(delay);
    }
  }
}
export async function undoUwuifyPage(delay = 10) {
  const uwuNodes = Array.from(
    document.querySelectorAll<HTMLSpanElement>("span[data-uwu='true']"),
  );

  for (const span of uwuNodes) {
    const original = span.dataset.original;
    if (!original) continue;

    const textNode = document.createTextNode(original);

    span.style.background = "rgba(var(--accent-code), 0.2)";
    span.style.transition = "background 0.4s ease";

    span.replaceWith(textNode);

    await sleep(delay);
  }
}

export function uwuifyText(text: string): string {
  return text
    .replace(/r|l/g, "w")
    .replace(/R|L/g, "W")
    .replace(/n([aeiou])/gi, "ny$1")
    .replace(/!+/g, " uwu!");
}
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
