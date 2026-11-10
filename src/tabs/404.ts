import { notFoundSubtitles } from "@constants/NotFoundSubtitles";
import { Random, clamp } from "@util/math";
import { createTimeline, splitText, stagger, easings } from "animejs";

const hourlyGifs = [
  "assets/g/funnycat.gif",
  "assets/g/orangecat.gif",
  "assets/g/wavingwelcomecat.gif",
];

const plsDo404Intro = () => {
  const introSectionEl = document.querySelector<HTMLElement>(
    "section#intro-section",
  );
  const headlineTop =
    introSectionEl?.querySelector<HTMLElement>("#headline-top");
  const headlineBottom =
    introSectionEl?.querySelector<HTMLElement>("#headline-bottom");
  const subtitleEl = introSectionEl?.querySelector<HTMLSpanElement>(
    "#subtitle > span > span",
  );
  const subtitleParent =
    introSectionEl?.querySelector<HTMLElement>("#subtitle");
  const catVideoContainer =
    introSectionEl?.querySelector<HTMLElement>("#meow-container");
  const gifImageEl =
    catVideoContainer?.querySelector<HTMLImageElement>("#meow-gif");
  const spinCatContainer = introSectionEl?.querySelector<HTMLElement>(
    "#spin-cat-container",
  );
  const spinCatEl =
    spinCatContainer?.querySelector<HTMLImageElement>("#spin-cat-gif");
  const homeBtn = introSectionEl?.querySelector<HTMLElement>("#home-btn");

  if (
    !introSectionEl ||
    !headlineTop ||
    !headlineBottom ||
    !subtitleEl ||
    !subtitleParent ||
    !catVideoContainer ||
    !gifImageEl ||
    !spinCatEl ||
    !spinCatContainer
  ) {
    console.error("Could not find 404 intro section elements");
    return;
  }

  const currentHour = new Date().getHours();
  const selectedGif = hourlyGifs[currentHour % hourlyGifs.length];
  gifImageEl.src = selectedGif;

  const subtitle = Random.arrayItem(notFoundSubtitles);
  subtitleEl.innerHTML = subtitle;

  headlineTop.style.opacity = "1";
  headlineBottom.style.opacity = "1";
  subtitleParent.style.opacity = "1";
  catVideoContainer.style.opacity = "1";
  spinCatContainer.style.opacity = "1";
  if (homeBtn) homeBtn.style.opacity = "1";

  const topChars = splitText(headlineTop, { chars: true }).chars;
  const bottomChars = splitText(headlineBottom, { chars: true }).chars;
  const subtitleChars = splitText(subtitleEl, { chars: true }).chars;

  topChars.forEach((c) => {
    (c as HTMLElement).style.opacity = "0";
  });
  bottomChars.forEach((c) => {
    (c as HTMLElement).style.opacity = "0";
  });
  subtitleChars.forEach((c) => {
    (c as HTMLElement).style.opacity = "0";
  });
  catVideoContainer.style.opacity = "0";
  spinCatContainer.style.opacity = "0";
  if (homeBtn) homeBtn.style.opacity = "0";

  const timeline = createTimeline({
    defaults: {
      ease: easings.cubicBezier(0.16, 1, 0.3, 1),
    },
  });

  timeline.add([topChars, bottomChars], {
    translateY: [28, 0],
    opacity: [0, 1],
    rotate: ["0.01turn", "0turn"],
    filter: ["blur(14px)", "blur(0px)"],
    duration: 800,
    delay: stagger(24),
  });

  const subtitleDuration = clamp(subtitleChars.length * 50, 800, 3000);

  timeline.add(
    subtitleChars,
    {
      translateY: [14, 0],
      opacity: [0, 1],
      filter: ["blur(8px)", "blur(0px)"],
      duration: subtitleDuration,
      delay: stagger(12),
    },
    "-=500",
  );

  timeline.add(
    [catVideoContainer, spinCatContainer],
    {
      scale: [0, 1],
      opacity: [0, 1],
      duration: 600,
      ease: "in(4)",
    },
    `-=${subtitleDuration + 200}`,
  );

  if (homeBtn) {
    timeline.add(
      homeBtn,
      {
        scale: [0.9, 1],
        opacity: [0, 1],
        filter: ["blur(4px)", "blur(0px)"],
        duration: 600,
        onComplete: () => {
          homeBtn.style.transform = "";
          homeBtn.style.filter = "";
        },
      },
      "-=400",
    );
  }
};

document.addEventListener("DOMContentLoaded", () => {
  plsDo404Intro();
});

