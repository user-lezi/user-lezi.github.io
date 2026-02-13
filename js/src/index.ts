import "./easter-eggs/index";
import { projectLoader } from "./projects/loader";
import { pickRandom } from "./util/random";
import { Yapper, resolveYap, STARTUP_YAPS } from "./yapper";

if (document.querySelector("div#projects-grid")) projectLoader();

const yapper = new Yapper();

document
  .querySelector("[summon-yapper]")!
  .addEventListener("click", async () => {
    if (yapper.visible) return;
    yapper.show();

    const line = await resolveYap(pickRandom(STARTUP_YAPS));
    yapper.yap(line, true);
  });

Reflect.set(window, "$", {
  yapper,
});
