import "./easter-eggs/index";
import { projectLoader } from "./projects/loader";
import { pickRandom } from "./util/random";
import { yapper, Yapper, resolveYap, STARTUP_YAPS } from "./yapper";

if (document.querySelector("div#projects-grid")) projectLoader();

document
  .querySelector("[summon-yapper]")!
  .addEventListener("click", async () => {
    if (yapper.visible) return;
    yapper.show();

    const line = await resolveYap(pickRandom(STARTUP_YAPS));
    yapper.yap(line, true);
  });

// Globals
declare global {
  interface Window {
    yapper: Yapper;
  }
}
window.yapper = yapper;
