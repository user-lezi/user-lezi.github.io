import { introSubtitles } from "@constants/IntroSubtitles";
import { PROJECTS } from "@constants/Projects";
import { CONTACTS } from "@constants/Contacts";
import { Random, clamp } from "@util/math";
import { createTimeline, splitText, stagger, easings, animate } from "animejs";

const hourlyGifs = [
  "assets/g/wavingwelcomecat.gif",
  "assets/g/funnycat.gif",
  "assets/g/orangecat.gif",
];

const plsDoIntro = () => {
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
    console.error("Could not find intro section elements", {
      introSectionEl,
      headlineTop,
      headlineBottom,
      subtitleEl,
      subtitleParent,
      catVideoContainer,
      gifImageEl,
      spinCatEl,
      spinCatContainer,
    });
    return;
  }

  const currentHour = new Date().getHours();
  const selectedGif = hourlyGifs[currentHour % hourlyGifs.length];
  gifImageEl.src = selectedGif;

  const subtitle = Random.arrayItem(introSubtitles);
  subtitleEl.innerHTML = subtitle;

  headlineTop.style.opacity = "1";
  headlineBottom.style.opacity = "1";
  subtitleParent.style.opacity = "1";
  catVideoContainer.style.opacity = "1";
  spinCatContainer.style.opacity = "1";

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
};
const plsDoScrollThemeMorph = () => {
  const aboutSection = document.querySelector<HTMLElement>("#about-me-section");
  if (!aboutSection) return;

  const root = document.documentElement;
  type RGB = [number, number, number];

  const parseColor = (raw: string): RGB | null => {
    let hex = raw.trim().replace(/^#/, "");
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    if (!/^[0-9a-f]{6}$/i.test(hex)) return null;
    const n = parseInt(hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };

  const toHex = ([r, g, b]: RGB) =>
    "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);

  const mix = (a: RGB, b: RGB, t: number): RGB => [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];

  const styles = getComputedStyle(root);
  const read = (name: string) => parseColor(styles.getPropertyValue(name));

  const channels = (["primary", "secondary", "muted"] as const).map((name) => ({
    target: `--color-${name}`,
    from: read(`--theme-light-${name}`),
    to: read(`--theme-dark-${name}`),
  }));

  if (channels.some((c) => !c.from || !c.to)) {
    console.warn(
      "Theme morph: --theme-light-* / --theme-dark-* must be defined on :root as hex colors.",
      channels,
    );
    return;
  }

  const update = () => {
    const vh = window.innerHeight;
    const maxScroll = document.documentElement.scrollHeight - vh;
    const sectionTop =
      aboutSection.getBoundingClientRect().top + window.scrollY;

    // Start when the section's top reaches 80% of the viewport...
    const startScroll = sectionTop - vh * 0.8;
    const endScroll = Math.min(sectionTop - vh * 0.2, maxScroll);

    const span = endScroll - startScroll;
    const progress =
      span <= 0
        ? window.scrollY >= startScroll
          ? 1
          : 0
        : Math.max(0, Math.min(1, (window.scrollY - startScroll) / span));

    for (const { target, from, to } of channels) {
      root.style.setProperty(target, toHex(mix(from!, to!, progress)));
    }
  };

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  window.addEventListener("load", update); // layout shifts once images load
  update();
};
const plsDoAboutAnimation = () => {
  const aboutSection = document.querySelector("#about-me-section");
  const bioElement = document.querySelector("#about-bio") as HTMLElement;
  const skillBadge = document.querySelector("#about-skills") as HTMLElement;
  const skillBadgesEl = skillBadge?.querySelectorAll("span");
  if (!aboutSection || !bioElement || !skillBadge || !skillBadgesEl) return;

  let hasAnimated = false;

  const observerOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: "0px 0px 5% 0px",
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        bioElement.style.opacity = "1";
        const { chars } = splitText(bioElement, { chars: true });
        chars.forEach((c) => {
          (c as HTMLElement).style.opacity = "0";
        });
        skillBadgesEl.forEach((c) => {
          (c as HTMLElement).style.opacity = "0";
        });
        const timeline = createTimeline({
          defaults: {
            ease: easings.cubicBezier(0.16, 1, 0.3, 1),
          },
        });
        timeline.add(chars, {
          translateY: [16, 0],
          opacity: [0, 1],
          filter: ["blur(4px)", "blur(0px)"],
          duration: 1200,
          delay: stagger(20),
        });

        timeline.add(
          skillBadgesEl,
          {
            scale: [0, 1],
            opacity: [0, 1],
            filter: ["blur(4px)", "blur(0px)"],
            duration: 1600,
            delay: stagger(100),
          },
          "-=500",
        );

        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);
  observer.observe(aboutSection);
};
const plsDoInjectProjectsSection = () => {
  if (PROJECTS.length === 0) {
    document.querySelector("#projects-section")?.classList.add("hidden");
    return;
  }
  const gridContainer = document.querySelector("#projects-grid");
  if (!gridContainer) return;

  gridContainer.innerHTML = "";

  PROJECTS.forEach((project) => {
    const card = document.createElement("div");
    card.className =
      "manga-card rounded-2xl overflow-hidden flex flex-col opacity-0 flex-none " +
      "basis-full sm:basis-[calc((100%-2rem)/2)] lg:basis-[calc((100%-5rem)/3)]";

    const topPanel = document.createElement("div");
    topPanel.className =
      "relative h-48 sm:h-56 bg-neutral-100 border-b-2 border-[var(--color-primary)] overflow-hidden flex items-center justify-center";

    if (project.previewImage) {
      const previewImage = document.createElement("img");
      previewImage.src = project.previewImage;
      previewImage.className =
        "absolute inset-0 w-full h-full object-cover center  ";
      previewImage.alt = project.title;
      previewImage.draggable = false;
      topPanel.appendChild(previewImage);
    }

    const gridBg = document.createElement("div");
    gridBg.className =
      "absolute inset-0 manga-panel-grid pointer-events-none mix-blend-overlay opacity-40";
    topPanel.appendChild(gridBg);

    const bottomPanel = document.createElement("div");
    bottomPanel.className =
      "p-6 sm:p-8 flex flex-col flex-grow justify-between gap-6 bg-[var(--color-secondary)]";

    const contentDiv = document.createElement("div");
    contentDiv.className = "flex flex-col gap-3";

    const heading = document.createElement("h3");
    heading.className =
      "font-extrabold text-xl sm:text-2xl text-[var(--color-primary)]";
    heading.textContent = project.title;

    const desc = document.createElement("p");
    desc.className =
      "font-medium text-[var(--color-muted)] text-sm sm:text-base leading-relaxed";
    desc.textContent = project.description;

    contentDiv.appendChild(heading);
    contentDiv.appendChild(desc);

    const btnWrapper = document.createElement("div");
    const link = document.createElement("a");
    link.href = project.link;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className =
      "manga-button inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-bold text-sm bg-[var(--color-secondary)] text-[var(--color-primary)]";
    link.textContent = project.buttonText;

    const arrow = document.createElement("i");
    arrow.className = "fa-solid fa-arrow-right text-lg ml-2";
    arrow.setAttribute("aria-hidden", "true");
    link.appendChild(arrow);

    btnWrapper.appendChild(link);

    bottomPanel.appendChild(contentDiv);
    bottomPanel.appendChild(btnWrapper);

    card.appendChild(topPanel);
    card.appendChild(bottomPanel);

    gridContainer.appendChild(card);
  });
};
const plsDoProjectsAnimation = () => {
  const viewport = document.querySelector<HTMLElement>("#projects-viewport");
  const gridContainer = document.querySelector<HTMLElement>("#projects-grid");
  if (!gridContainer || !viewport) return;

  const cards = gridContainer.querySelectorAll<HTMLElement>("div.manga-card");
  cards.forEach((card) => {
    card.style.opacity = "0";
  });

  const observerOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: "0px 0px 5% 0px",
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries, obs) => {
    const timeline = createTimeline({
      defaults: {
        ease: "out(1.675)",
      },
    });
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        cards.forEach((card) => {
          timeline.add(
            card,
            {
              translateY: [32, 0],
              opacity: [0, 1],
              filter: ["blur(4px)", "blur(0px)"],
              duration: 800,
            },
            "*=.1",
          );
        });
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);
  observer.observe(viewport);
};
const plsDoProjectsCarousel = () => {
  const viewport = document.querySelector<HTMLElement>("#projects-viewport");
  const track = document.querySelector<HTMLElement>("#projects-grid");
  const dotsEl = document.querySelector<HTMLElement>("#projects-dots");
  const prevBtn = document.querySelector<HTMLButtonElement>("#projects-prev");
  const nextBtn = document.querySelector<HTMLButtonElement>("#projects-next");
  const controls = document.querySelector<HTMLElement>("#projects-controls");
  if (!viewport || !track || !dotsEl || !prevBtn || !nextBtn || !controls)
    return;
  const toggleControls = (show: boolean) =>
    controls.classList.toggle("hidden", !show);
  const cards = Array.from(track.children) as HTMLElement[];
  if (cards.length < 2) {
    toggleControls(false);
    return;
  }
  const INTERVAL = 4000;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  let index = 0;
  let timer: number | undefined;
  let hovering = false;
  let inView = false;

  const stepSize = () =>
    cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 0;

  const perView = () => {
    const step = stepSize();
    if (step <= 0) return 1; // layout not ready yet
    const gap = step - cards[0].offsetWidth;
    const n = Math.round((track.clientWidth + gap) / step);
    return Number.isFinite(n) ? Math.max(1, n) : 1;
  };
  const maxIndex = () => Math.max(0, cards.length - perView());

  const renderDots = () => {
    dotsEl.innerHTML = "";
    const max = maxIndex();
    dotsEl.style.display = max === 0 ? "none" : "";
    for (let i = 0; i <= max; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dot.className =
        "w-2.5 h-2.5 rounded-full border-2 border-[var(--color-primary)] transition-all duration-300";
      dot.addEventListener("click", () => {
        goTo(i);
        restart();
      });
      dotsEl.appendChild(dot);
    }
  };

  const updateDots = () => {
    Array.from(dotsEl.children).forEach((d, i) => {
      const active = i === index;
      d.classList.toggle("w-6", active);
      d.classList.toggle("bg-[var(--color-primary)]", active);
      d.classList.toggle("w-2.5", !active);
    });
  };

  const goTo = (i: number) => {
    const max = maxIndex();
    index = i > max ? 0 : i < 0 ? max : i; // wrap around
    track.style.transform = `translateX(${-index * stepSize()}px)`;
    updateDots();
  };

  const stop = () => {
    window.clearInterval(timer);
    timer = undefined;
  };
  const start = () => {
    if (reduceMotion || timer !== undefined) return;
    timer = window.setInterval(() => goTo(index + 1), INTERVAL);
  };
  const restart = () => {
    stop();
    if (!hovering && inView) start();
  };

  prevBtn.addEventListener("click", () => {
    goTo(index - 1);
    restart();
  });
  nextBtn.addEventListener("click", () => {
    goTo(index + 1);
    restart();
  });

  // pause on hover / keyboard focus
  const pause = () => {
    hovering = true;
    stop();
  };
  const resume = () => {
    hovering = false;
    if (inView) start();
  };
  viewport.addEventListener("mouseenter", pause);
  viewport.addEventListener("mouseleave", resume);
  viewport.addEventListener("focusin", pause);
  viewport.addEventListener("focusout", resume);

  // swipe / drag
  let startX = 0;
  viewport.addEventListener("pointerdown", (e) => {
    startX = e.clientX;
  });
  viewport.addEventListener("pointerup", (e) => {
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 50) {
      goTo(dx < 0 ? index + 1 : index - 1);
      restart();
    }
  });

  // only autoplay while the section is on screen
  new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      inView && !hovering ? start() : stop();
    },
    { threshold: 0.3 },
  ).observe(viewport);

  document.addEventListener("visibilitychange", () => {
    document.hidden ? stop() : restart();
  });

  let dotCount = -1;
  const sync = () => {
    const count = maxIndex() + 1;
    toggleControls(count > 1); // hide arrows + dots when nothing slides
    if (count !== dotCount) {
      dotCount = count;
      renderDots();
    }
    goTo(Math.min(index, maxIndex()));
  };

  new ResizeObserver(sync).observe(viewport);
  window.addEventListener("load", sync); // fonts/images/late styles
  sync();
};

const plsDoInjectContactsSection = () => {
  if (CONTACTS.length === 0) {
    document.querySelector("#contacts-section")?.classList.add("hidden");
    return;
  }

  const listContainer = document.querySelector<HTMLElement>("#contacts-list");
  if (!listContainer) return;

  listContainer.innerHTML = "";

  CONTACTS.forEach((contact) => {
    const item = document.createElement("a");
    item.href = contact.link;
    item.target = "_blank";
    item.rel = "noopener noreferrer";
    item.className =
      "contact-pill manga-button inline-flex items-center gap-3.5 px-5 py-3 rounded-xl bg-[var(--color-secondary)] text-[var(--color-primary)] font-bold text-sm sm:text-base opacity-0";

    const icon = document.createElement("i");
    icon.className = `${contact.icon} text-xl text-[var(--color-primary)]`;
    icon.setAttribute("aria-hidden", "true");

    const textWrapper = document.createElement("div");
    textWrapper.className = "flex flex-col text-left";

    const nameSpan = document.createElement("span");
    nameSpan.className =
      "text-xs uppercase tracking-wider text-[var(--color-muted)] font-semibold leading-tight";
    nameSpan.textContent = contact.name;

    const handleSpan = document.createElement("span");
    handleSpan.className = "text-sm sm:text-base font-bold leading-tight";
    handleSpan.textContent = contact.handle;

    textWrapper.appendChild(nameSpan);
    textWrapper.appendChild(handleSpan);

    const arrow = document.createElement("i");
    arrow.className = "fa-solid fa-arrow-right text-base ml-auto";
    arrow.setAttribute("aria-hidden", "true");

    item.appendChild(icon);
    item.appendChild(textWrapper);
    item.appendChild(arrow);

    listContainer.appendChild(item);
  });
};

const plsDoContactsAnimation = () => {
  const section = document.querySelector<HTMLElement>("#contacts-section");
  const bio = document.querySelector<HTMLElement>("#contacts-bio");
  if (!section || !bio) return;
  const pills = section.querySelectorAll<HTMLElement>(".contact-pill");
  if (pills.length === 0) return;

  let hasAnimated = false;

  const observerOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: "0px 0px 5% 0px",
    threshold: 0.3,
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        bio.style.opacity = "1";

        const { chars } = splitText(bio, { chars: true });
        chars.forEach((c) => {
          (c as HTMLElement).style.opacity = "0";
        });
        pills.forEach((p) => {
          p.style.opacity = "0";
        });

        const timeline = createTimeline({
          defaults: {
            ease: easings.cubicBezier(0.16, 1, 0.3, 1),
          },
        });

        timeline.add(chars, {
          translateY: [16, 0],
          opacity: [0, 1],
          filter: ["blur(4px)", "blur(0px)"],
          duration: 1000,
          delay: stagger(12),
        });

        timeline.add(
          Array.from(pills),
          {
            scale: [0.85, 1],
            translateY: [16, 0],
            opacity: [0, 1],
            filter: ["blur(4px)", "blur(0px)"],
            duration: 900,
            delay: stagger(80),
            onComplete: () => {
              pills.forEach((p) => {
                p.style.transform = "";
              });
            },
          },
          "-=400",
        );

        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  observer.observe(section);
};

document.addEventListener("DOMContentLoaded", () => {
  plsDoIntro();
  plsDoScrollThemeMorph();
  plsDoAboutAnimation();
  plsDoInjectProjectsSection();
  plsDoProjectsAnimation();
  plsDoProjectsCarousel();
  plsDoInjectContactsSection();
  plsDoContactsAnimation();
  console.log("Crazy, isnt it?");
});

history.scrollRestoration = "manual";

if (window.location.hash) {
  history.replaceState(
    null,
    "",
    window.location.pathname + window.location.search,
  );
}

window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});
