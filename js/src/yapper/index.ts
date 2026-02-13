import { parseMarkdown } from "../util/markdown";

export class Yapper {
  private container: HTMLDivElement;
  private bubble: HTMLDivElement;
  private avatar: HTMLImageElement;

  private queue: string[] = [];
  private isTalking = false;

  public visible = false;
  public wpm = 200;

  constructor() {
    this.container = document.createElement("div");

    this.container.classList.add(
      "fixed",
      "bottom-6",
      "right-6",
      "z-[9999]",
      "flex",
      "items-end",
      "justify-end",
      "translate-y-[140%]",
      "transition-transform",
      "duration-300",
      "ease-out",
    );

    this.avatar = document.createElement("img");
    this.avatar.src = "./images/yapper.jpg";

    this.avatar.classList.add(
      "w-16",
      "h-16",
      "rounded-full",
      "shadow-lg",
      "shrink-0",
      "transition-transform",
      "duration-300",
      "ease-[cubic-bezier(.34,1.56,.64,1)]",
    );

    this.bubble = document.createElement("div");

    this.bubble.classList.add(
      "mr-3",
      "px-3",
      "py-2",
      "inline-block",
      "w-fit",
      "max-w-[280px]",
      "rounded-xl",
      "text-sm",
      "leading-relaxed",
      "bg-[#0e0f14]",
      "text-slate-200",
      "shadow-xl",
      "opacity-0",
      "translate-y-2",
      "transition-all",
      "duration-200",
      "pointer-events-none",

      // wrapping
      "whitespace-pre-wrap",
      "break-words",
      "[overflow-wrap:anywhere]",

      // Markdown styling
      "[&_code]:bg-black/40",
      "[&_code]:px-1",
      "[&_code]:rounded",
      "[&_code]:font-mono",
      "[&_a]:text-blue-400",
      "[&_a:hover]:underline",
    );

    this.container.append(this.bubble, this.avatar);
    document.body.appendChild(this.container);
  }

  /* visibility */

  show() {
    this.visible = true;
    this.container.classList.remove("translate-y-[140%]");
    this.container.classList.add("translate-y-0");

    this.processQueue();
  }

  hide() {
    this.visible = false;
    this.container.classList.add("translate-y-[140%]");
    this.container.classList.remove("translate-y-0");
  }

  /* YAPPPP */

  yap(msg: string, force = false) {
    if (force) this.queue.unshift(msg);
    else this.queue.push(msg);

    this.processQueue();
  }

  /* queue */

  private async processQueue() {
    if (this.isTalking || !this.visible) return;
    if (!this.queue.length) return;

    this.isTalking = true;

    this.startTalking();

    const msg = this.queue.shift()!;
    await this.typeMessage(msg);

    await this.sleep(this.getReadingTime(msg));

    this.stopBubble();

    await this.sleep(200);

    this.isTalking = false;

    if (!this.queue.length) this.stopTalking();

    this.processQueue();
  }

  /* state */

  private startTalking() {
    // avatar move
    this.avatar.classList.add("-translate-x-2");

    // bubble show
    this.bubble.classList.remove("opacity-0", "translate-y-2");
    this.bubble.classList.add("opacity-100", "translate-y-0");
  }

  private stopTalking() {
    this.avatar.classList.remove("-translate-x-2");
  }

  private stopBubble() {
    this.bubble.classList.add("opacity-0", "translate-y-2");
    this.bubble.classList.remove("opacity-100", "translate-y-0");
  }

  /* typing */

  private async typeMessage(msg: string) {
    let current = "";

    for (let i = 0; i < msg.length; i++) {
      const char = msg[i];
      current += char;

      this.bubble.innerHTML = parseMarkdown(current);

      await this.sleep(this.getTypingDelay(char));
    }
  }

  private getTypingDelay(char: string) {
    const mdSymbols = "*`[()_~";

    // markdown symbols type nearly instantly
    if (char === "]") return 140;
    if (mdSymbols.includes(char)) return 2;

    // punctuation pause
    if (".!?".includes(char)) return 200 + Math.random() * 80;
    if (",:;".includes(char)) return 120 + Math.random() * 60;

    // normal typing
    return 10 + Math.random() * 18;
  }

  /* helpers */

  private getReadingTime(text: string) {
    const words = text.trim().split(/\s+/).length;

    // long messages skim faster
    const factor = this.getWordScalingFactor(words);

    const effectiveWords = words * factor;

    return (effectiveWords / this.wpm) * 60000 + 600;
  }

  private getWordScalingFactor(words: number) {
    // <= 16 words → full reading time
    if (words <= 16) return 1;

    // >= 60 words → 50% reading time
    if (words >= 60) return 0.5;

    // smooth interpolation between 16 → 60
    const t = (words - 16) / (60 - 16);
    return 1 - t * 0.5;
  }

  private sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
}

export * from "./lines";
